export interface Prop {
    groupId: number;
    entityId: number;
    propId: number;
    distance: number;
    type: string;
    category: string;
    state: string;
    stateId: number;
    validStates: Record<string, number>;
}

