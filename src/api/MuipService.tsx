import axios from 'axios';
import JSEncrypt from 'jsencrypt';

const API_BASE_URL = 'http://127.0.0.1:443/muip';

class MuipService {
  private static readonly MIN_CALL_INTERVAL: number = 100;
  private static adminKey: string | null = null;
  private static lastCallTimestamp: number = 0;
  private static callQueue: Promise<void> = Promise.resolve();
  private static rsaPublicKey: string = '';
  private static sessionId: string | null = null;
  private static sessionExpireTime: number = 0;

  static setAdminKey(key: string) {
    this.adminKey = key;
  }

  /**
   * Execute a command on the server.
   * @param {string} command - The unencrypted command to be executed.
   * @param {number} targetUid - The UID of the target player.
   */

  static async executeCommand(command: string, targetUid: number) {
    await this.ensureValidSession();
    const encryptedCommand = this.encryptMessage(command);
    await this.enforceCallInterval();
    try {
      const response = await axios.post(`${API_BASE_URL}/exec_cmd`, {
        SessionId: this.sessionId,
        Command: encryptedCommand,
        TargetUid: targetUid,
      });
      if (response.data.code !== 0) {
        throw new Error(response.data.message);
      }
      // Decode base64 message to UTF-8
      const base64Message = response.data.data.message;
      const binaryString = atob(base64Message);
      const decoder = new TextDecoder('utf-8');
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const decodedMessage = decoder.decode(bytes);
      return { code: response.data.code, message: decodedMessage };
    } catch (error) {
      console.error('Error executing command:', error);
      throw error;
    }
  }

  /**
   * Get the server information.
   */
  static async getServerInformation() {
    await this.ensureValidSession();
    await this.enforceCallInterval();
    try {
      const response = await axios.get(`${API_BASE_URL}/server_information`, {
        params: { SessionId: this.sessionId },
      });
      if (response.data.code !== 0) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching server information:', error);
      throw error;
    }
  }

  /**
   * Get player information.
   * @param {number} uid - The UID of the player.
   */
  static async getPlayerInformation(uid: number) {
    await this.ensureValidSession();
    await this.enforceCallInterval();
    try {
      const response = await axios.get(`${API_BASE_URL}/player_information`, {
        params: { SessionId: this.sessionId, Uid: uid },
      });
      if (response.data.code !== 0) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching player information:', error);
      throw error;
    }
  }

  private static async ensureValidSession(): Promise<void> {
    const now = Date.now();
    if (!this.sessionId || now >= this.sessionExpireTime) {
      const response = await this.createSession();
      this.sessionId = response.sessionId;
      this.sessionExpireTime = response.expireTimeStamp;
      this.rsaPublicKey = response.rsaPublicKey;
      await this.authorizeAdmin();
    }
  }

  private static async createSession(): Promise<{ sessionId: string; expireTimeStamp: number; rsaPublicKey: string }> {
    await this.enforceCallInterval();
    try {
      const response = await axios.post(`${API_BASE_URL}/create_session`, { key_type: 'PEM' });
      if (response.data.code !== 0) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  private static async authorizeAdmin(): Promise<any> {
    if (!this.sessionId) throw new Error('No session ID available');
    await this.enforceCallInterval();
    try {
      const response = await axios.post(`${API_BASE_URL}/auth_admin`, {
        session_id: this.sessionId,
        admin_key: this.encryptMessage(this.adminKey as string),
      });
      if (response.data.code !== 0) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      console.error('Error authorizing admin:', error);
      throw error;
    }
  }

  private static enforceCallInterval(): Promise<void> {
    this.callQueue = this.callQueue.then(async () => {
      const now = Date.now();
      const timeSinceLastCall = now - this.lastCallTimestamp;
      if (timeSinceLastCall < this.MIN_CALL_INTERVAL) {
        await new Promise((resolve) => setTimeout(resolve, this.MIN_CALL_INTERVAL - timeSinceLastCall));
      }
      this.lastCallTimestamp = Date.now();
    });
    return this.callQueue;
  }

  private static encryptMessage(command: string): string {
    if (!this.rsaPublicKey) {
      throw new Error('RSA public key is not set. Please create a session first.');
    }

    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(this.rsaPublicKey);
    const encrypted = encryptor.encrypt(command);

    if (!encrypted) {
      throw new Error('Encryption failed. Please verify the public key.');
    }

    return encrypted;
  }
}

export default MuipService;
