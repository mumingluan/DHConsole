export interface Relic {
    relicId?: number;
    level?: number;
    mainAffixId?: number;
    subAffixIds?: Record<number, number>;
    subAffixLevels?: Record<number, number>;
    subAffixSteps?: Record<number, number>;
}

export interface CharacterInfo {
    pathId?: number,
    level?: number,
    rank?: number,
    talent?: Record<number, number>,
    equipId?: number,
    equipLevel?: number,
    equipRank?: number,
    relics?: Record<number, Relic>;
}
