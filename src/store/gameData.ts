
export enum GameEntity {
  Avatar = "avatar",
  Equip = "equip",
  Relic = "relic",
  Mission = "mission",
  Submission = "submission",
}

class GameData {
  static defaultLanguage: string = "en";
  static entities: Record<string, Record<number, string>> = {}; // Map of Language to ID to name
  static entityTypes: Record<number, GameEntity> = {}; // Map of ID to entity type

  public static setDefaultLanguage(language: string): void {
    this.defaultLanguage = language;
  }

  public static get(key: number, language: string = this.defaultLanguage): string {
      return this.entities[language][key];
  }

  public static getType(key: number): GameEntity {
    return this.entityTypes[key];
  }

  public static set(key: number, value: string, type: GameEntity, language: string): void {
      this.entities[language][key] = value;
      this.entityTypes[key] = type;
  }

  public static getAllMainMissions(): Record<string, number> {
    // TODO: Implement this
    return {"Demo": 123};
  }

  public static getAllSubMissions(mainMissionId: number): Record<string, number> {
    // TODO: Implement this
    return {"Demo": 123};
  }
}

export default GameData;



