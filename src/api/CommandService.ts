import MuipService from './MuipService';

class CommandService {
  static readonly languageMap: Record<string, string> = {
    'zh_CN': 'CHS',
    'zh_HK': 'CHT',
    'en': 'EN',
    'ja': 'JP',
    'ko': 'KR',
    'es': 'ES',
    'fr': 'FR',
    'id': 'ID',
    'pt': 'PT',
    'ru': 'RU',
    'th': 'TH',
    'vi': 'VI',
  };
  static playerUid: number = 0;

  static setPlayerUid(playerUid: number) {
    this.playerUid = playerUid;
  }

  static async executeCommand(command: string): Promise<string> {
    try {
      console.log('Executing command:', command);
      const response = await MuipService.executeCommand(command, this.playerUid);
      if (response.code !== 0) {
        throw new Error(`Command failed: ${response.message}`);
      }
      return response.message;
    } catch (error) {
      console.error(`Error executing command: ${command}`, error);
      throw error;
    }
  }

  static async loadAvatarGameText(lang: string): Promise<Record<number, string>> {
    if (!this.languageMap[lang]) {
      throw new Error(`Invalid language code: ${lang}`);
    }
    const command = `gametext avatar #${this.languageMap[lang]}`;
    const result = await this.executeCommand(command);
    return this.parseGameText(result);
  }

  static async loadItemGameText(lang: string): Promise<Record<number, string>> {
    if (!this.languageMap[lang]) {
      throw new Error(`Invalid language code: ${lang}`);
    }
    const command = `gametext item #${this.languageMap[lang]}`;
    const result = await this.executeCommand(command);
    return this.parseGameText(result);
  }

  static async loadMainMissionGameText(lang: string): Promise<Record<number, string>> {
    if (!this.languageMap[lang]) {
      throw new Error(`Invalid language code: ${lang}`);
    }
    const command = `gametext mainmission #${this.languageMap[lang]}`;
    const result = await this.executeCommand(command);
    return this.parseGameText(result);
  }

  static async loadSubMissionGameText(lang: string): Promise<Record<number, string>> {
    if (!this.languageMap[lang]) {
      throw new Error(`Invalid language code: ${lang}`);
    }
    const command = `gametext submission #${this.languageMap[lang]}`;
    const result = await this.executeCommand(command);
    return this.parseGameText(result);
  }

  static async setAvatarLevel(avatarId: number, level: number): Promise<{ avatarId: number; level: number }> {
    const command = `avatar level ${avatarId} ${level}`;
    const result = await this.executeCommand(command);
    return { avatarId, level: parseInt(result, 10) || level };
  }

  static async getInventory(): Promise<Record<number, number>> {
    const command = `fetch inventory`;
    const result = await this.executeCommand(command);
    return this.parseItemList(result);
  }

  static async giveItem(itemId: number, count = 1): Promise<{ itemId: number; count: number }> {
    const command = `give ${itemId} x${count}`;
    const result = await this.executeCommand(command);
    return { itemId, count: parseInt(result, 10) || count };
  }

  static async setPlayerLevel(level: number): Promise<{ level: number }> {
    const command = `setlevel ${level}`;
    const result = await this.executeCommand(command);
    return { level: parseInt(result, 10) || level };
  }

  static async getCurrentMissions(): Promise<Record<number, number[]>> {
    const command = `mission running`;
    const result = await this.executeCommand(command);
    return this.parseLists(result);
  }

  static async finishMainMission(mainMissionId: number): Promise<string> {
    const command = `mission finishmain ${mainMissionId}`;
    const result = await this.executeCommand(command);
    return result;
  }

  static async finishSubMission(subMissionId: number): Promise<string> {
    const command = `mission finish ${subMissionId}`;
    const result = await this.executeCommand(command);
    return result;
  }

  static async acceptMainMission(mainMissionId: number): Promise<string> {
    const command = `mission reaccept ${mainMissionId}`;
    const result = await this.executeCommand(command);
    return result;
  }

  static async removeUnusedRelics(): Promise<string> {
    const command = `remove relics`;
    const result = await this.executeCommand(command);
    return result;
  }

  static async removeUnusedEquipment(): Promise<string> {
    const command = `remove equipment`;
    const result = await this.executeCommand(command);
    return result;
  }

  private static parseGameText(response: string): Record<number, string> {
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

  private static parseItemList(response: string): Record<number, number> {
    const lines = response.split('\n');
    const data: Record<number, number> = {};
    for (const line of lines) {
      const [id, value] = line.split(':');
      if (id && value) {
        data[parseInt(id, 10)] = parseInt(value, 10);
      }
    }
    return data;
  }


  private static parseLists(response: string): Record<number, number[]> {
    const lines = response.split('\n');
    const data: Record<number, number[]> = {};
    let currentMainId = null;
    for (const line of lines.slice(1)) {
      if (line.includes('Main task')) {
        const mainTaskMatch = line.match(/Main task (\d+).*/);
        if (mainTaskMatch && mainTaskMatch[1]) {
          currentMainId = parseInt(mainTaskMatch[1], 10);
          data[currentMainId] = [];
        }
      } else if (line.includes('Possibly stuck tasks')) {
        break;
      } else if (currentMainId) {
        const subIds = line.trim().split('、').map(Number);
        data[currentMainId].push(...subIds);
      }
    }
    return data;
  }
}

export default CommandService;