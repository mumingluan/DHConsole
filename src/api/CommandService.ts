import MuipService from './MuipService';
import { GameEntity } from '../store/gameData';

class CommandService {
  static playerUid: number = 0;

  static setPlayerUid(playerUid: number) {
    this.playerUid = playerUid;
  }

  static async executeCommand(command: string): Promise<any> {
    try {
      const response = await MuipService.executeCommand(command, this.playerUid);
      if (response.code !== 0) {
        throw new Error(`Command failed: ${response.message}`);
      }
      return this.parseKeyValuePairs(response.message);
    } catch (error) {
      console.error(`Error executing command: ${command}`, error);
      throw error;
    }
  }

  static async setAvatarLevel(avatarId: number, level: number): Promise<{ avatarId: number; level: number }> {
    const command = `/avatar level ${avatarId} ${level}`;
    const result = await this.executeCommand(command);
    return { avatarId, level: result || level };
  }

  static async giveItem(itemId: number, count = 1): Promise<{ itemId: number; count: number }> {
    const command = `/give ${itemId} x${count}`;
    const result = await this.executeCommand(command);
    return { itemId, count: result || count };
  }

  static async setPlayerLevel(level: number): Promise<{ level: number }> {
    const command = `/setlevel ${level}`;
    const result = await this.executeCommand(command);
    return { level: result || level };
  }

  static async getCurrentMissions(): Promise<Record<number, number[]>> {
    const command = `/mission running`;
    const result = await this.executeCommand(command);
    return this.parseLists(result);
  }

  static async finishMainMission(mainMissionId: number): Promise<string> {
    const command = `/mission finishmain ${mainMissionId}`;
    const result = await this.executeCommand(command);
    return result;
  }

  static async finishSubMission(subMissionId: number): Promise<string> {
    const command = `/mission finish ${subMissionId}`;
    const result = await this.executeCommand(command);
    return result;
  }

  static async acceptMainMission(mainMissionId: number): Promise<string> {
    const command = `/mission reaccept ${mainMissionId}`;
    const result = await this.executeCommand(command);
    return result;
  }

  static async fetchEntityData(type: GameEntity): Promise<Record<number, string>> {
    const command = `/fetch ${type}`;
    const result = await this.executeCommand(command);
    const data: Record<number, string> = {};
    for (const line of result.split('\n')) {
      const [id, name] = line.split(':');
      if (id && name) {
        data[parseInt(id, 10)] = name.trim();
      }
    }
    return data;
  }

  private static parseKeyValuePairs(response: string): any {
    const lines = response.split('\n');
    const data: Record<number, string> = {};
    for (const line of lines) {
      const [id, value] = line.split(':');
      if (id && value) {
        data[parseInt(id, 10)] = value.trim();
      }
    }
    return data;
  }

  private static parseLists(response: string): Record<number, number[]> {
    const lines = response.split('\n');
    const data: Record<number, number[]> = {};
    let currentMainId = null;
    for (const line of lines) {
      if (line.endsWith(':')) {
        currentMainId = parseInt(line.replace(':', ''), 10);
        data[currentMainId] = [];
      } else if (currentMainId) {
        const subIds = line.trim().split(',').map(Number);
        data[currentMainId].push(...subIds);
      }
    }
    return data;
  }
}

export default CommandService;