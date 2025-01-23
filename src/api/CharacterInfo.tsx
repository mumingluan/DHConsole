export interface Relic {
    relicId?: number;
    level?: number;
    mainAffix?: string;
    subAffixes?: string[];
    subAffixLevels?: number[];
    subAffixSteps?: number[];
}

export interface Character {
    pathId?: number,
    level?: number,
    rank?: number,
    talent?: Record<number, number>,
    equipId?: number,
    equipLevel?: number,
    equipRank?: number,
    relics?: Record<number, Relic>;
}

const HEAD_MAIN_AFFIXES = ["HPDelta"];
const HAND_MAIN_AFFIXES = ["AttackDelta"];
const BODY_MAIN_AFFIXES = [
    "HPAddedRatio",
    "AttackAddedRatio",
    "DefenceAddedRatio",
    "CriticalChanceBase",
    "CriticalDamageBase",
    "HealRatioBase",
    "StatusProbabilityBase"
];
const FOOT_MAIN_AFFIXES = [
    "HPAddedRatio",
    "AttackAddedRatio",
    "DefenceAddedRatio",
    "SpeedDelta"
];
const NECK_MAIN_AFFIXES = [
    "HPAddedRatio",
    "AttackAddedRatio",
    "DefenceAddedRatio",
    "PhysicalAddedRatio",
    "FireAddedRatio",
    "IceAddedRatio",
    "ThunderAddedRatio",
    "WindAddedRatio",
    "QuantumAddedRatio",
    "ImaginaryAddedRatio",
];
const OBJECT_MAIN_AFFIXES = [
    "BreakDamageAddedRatioBase",
    "SPRatioBase",
    "HPAddedRatio",
    "AttackAddedRatio",
    "DefenceAddedRatio"
];

export const MAIN_AFFIXES = [
    [], // enum value starts from 1
    HEAD_MAIN_AFFIXES,
    HAND_MAIN_AFFIXES,
    BODY_MAIN_AFFIXES,
    FOOT_MAIN_AFFIXES,
    NECK_MAIN_AFFIXES,
    OBJECT_MAIN_AFFIXES
];
export const SUB_AFFIXES = [
    "HPDelta",
    "AttackDelta",
    "DefenceDelta",
    "HPAddedRatio",
    "AttackAddedRatio",
    "DefenceAddedRatio",
    "SpeedDelta",
    "CriticalChanceBase",
    "CriticalDamageBase",
    "StatusProbabilityBase",
    "StatusResistanceBase",
    "BreakDamageAddedRatioBase"
];
export const RELIC_NAMES = ["", "Head", "Hand", "Body", "Foot", "Neck", "Object"];