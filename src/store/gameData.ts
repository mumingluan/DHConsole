import CommandService from "../api/CommandService";

enum GameEntity {
  Avatar = "Avatar",
  Item = "Item",
  MainMission = "MainMission",
  SubMission = "SubMission",
}

class GameData {
  static defaultLanguage: string = "en";
  static entities: Record<string, Record<number, string>> = {}; // Map of Language to ID to name
  static entityTypes: Record<number, GameEntity> = {}; // Map of ID to entity type
  // loaded pairs of language and GameEntities as tuples
  static loadedEntities: Set<[GameEntity, string]> = new Set();

  public static setDefaultLanguage(language: string): void {
    this.defaultLanguage = language;
  }

  public static async loadAvatar(language: string): Promise<void> {
    if (this.loadedEntities.has([GameEntity.Avatar, language])) {
      return;
    }
    const parsed = await CommandService.loadAvatarGameText(language);
    this.storeData(parsed, GameEntity.Avatar, language);
  }

  public static async loadItem(language: string): Promise<void> {
    if (this.loadedEntities.has([GameEntity.Item, language])) {
      return;
    }
    const parsed = await CommandService.loadItemGameText(language);
    this.storeData(parsed, GameEntity.Item, language);
  }

  public static async loadMainMission(language: string): Promise<void> {
    if (this.loadedEntities.has([GameEntity.MainMission, language])) {
      return;
    }
    const parsed = await CommandService.loadMainMissionGameText(language);
    this.storeData(parsed, GameEntity.MainMission, language);
  }

  public static async loadSubMission(language: string): Promise<void> {
    if (this.loadedEntities.has([GameEntity.SubMission, language])) {
      return;
    }
    const parsed = await CommandService.loadSubMissionGameText(language);
    this.storeData(parsed, GameEntity.SubMission, language);
  }

  private static storeData(data: Record<number, string>, entity: GameEntity, language: string): void {
    for (const [key, value] of Object.entries(data)) {
      GameData.set(parseInt(key, 10), value, entity, language);
    }
    this.loadedEntities.add([entity, language]);
    console.log('Loaded', Object.keys(data).length, 'entities for', entity, 'in', language);
  }

  public static get(key: number, language: string = this.defaultLanguage): string {
    if (!this.entities[language]) {
      return "ERROR_NOT_LOADED_BY_CONSOLE";
    }
    if (!this.entities[language][key]) {
      return "ERROR_NOT_FOUND";
    }
    return this.entities[language][key];
  }

  public static getType(key: number): GameEntity {
    return this.entityTypes[key];
  }

  public static set(key: number, value: string, type: GameEntity, language: string): void {
    if (!this.entities[language]) {
      this.entities[language] = {};
    }
    this.entities[language][key] = value;
    this.entityTypes[key] = type;
  }

  public static getAllMainMissions(language: string): Record<number, string> {
    if (!this.entities[language]) {
      return {};
    }
    const result: Record<number, string> = {};
    for (const key in this.entities[language]) {
      if (this.entityTypes[key] === GameEntity.MainMission) {
        result[key] = this.entities[language][key];
      }
    }
    return result;
  }
}

export default GameData;



