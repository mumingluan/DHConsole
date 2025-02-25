import CommandService from '../CommandService';
import { MAIN_AFFIXES, SUB_AFFIXES } from '../CharacterInfo';

describe('CommandService', () => {
    describe('parseRelicRecommend', () => {
        it('should correctly parse relic recommend response', () => {
            // Arrange
            const mockResponse =
                `[1] 61101 1 8:1 9:3 5:2 7:3
[2] 61102 1 8:1 9:2 5:2 7:4
[3] 61103 4 9:2 5:2 7:4 11:1
[4] 61104 4 8:4 9:2 5:2 11:1
[5] 63115 8 8:1 9:2 5:2 7:4
[6] 63116 4 8:3 9:3 7:2 11:1`;

            // Act
            const result = CommandService.parseRelicRecommend(mockResponse);

            // Assert
            expect(result[1]).toEqual({
                relicId: 61101,
                level: 15,
                mainAffix: MAIN_AFFIXES[1][0], // slot 1, index 1-1
                subAffixes: [
                    SUB_AFFIXES[7], // index 8-1
                    SUB_AFFIXES[8], // index 9-1
                    SUB_AFFIXES[4], // index 5-1
                    SUB_AFFIXES[6], // index 7-1
                ],
                subAffixLevels: [1, 3, 2, 3],
                subAffixSteps: [1, 3, 2, 3],
            });

            expect(result[2]).toEqual({
                relicId: 61102,
                level: 15,
                mainAffix: MAIN_AFFIXES[2][0], // slot 2, index 1-1
                subAffixes: [
                    SUB_AFFIXES[7], // index 8-1
                    SUB_AFFIXES[8], // index 9-1
                    SUB_AFFIXES[4], // index 5-1
                    SUB_AFFIXES[6], // index 7-1
                ],
                subAffixLevels: [1, 2, 2, 4],
                subAffixSteps: [1, 2, 2, 4],
            });

            expect(result[3]).toEqual({
                relicId: 61103,
                level: 15,
                mainAffix: MAIN_AFFIXES[3][3], // slot 3, index 4-1
                subAffixes: [
                    SUB_AFFIXES[8], // index 9-1
                    SUB_AFFIXES[4], // index 5-1
                    SUB_AFFIXES[6], // index 7-1
                    SUB_AFFIXES[10], // index 11-1
                ],
                subAffixLevels: [2, 2, 4, 1],
                subAffixSteps: [2, 2, 4, 1],
            });

            expect(result[4]).toEqual({
                relicId: 61104,
                level: 15,
                mainAffix: MAIN_AFFIXES[4][3], // slot 4, index 4-1
                subAffixes: [
                    SUB_AFFIXES[7], // index 8-1
                    SUB_AFFIXES[8], // index 9-1
                    SUB_AFFIXES[4], // index 5-1
                    SUB_AFFIXES[10], // index 11-1
                ],
                subAffixLevels: [4, 2, 2, 1],
                subAffixSteps: [4, 2, 2, 1],
            });

            expect(result[5]).toEqual({
                relicId: 63115,
                level: 15,
                mainAffix: MAIN_AFFIXES[5][7], // slot 5, index 8-1
                subAffixes: [
                    SUB_AFFIXES[7], // index 8-1
                    SUB_AFFIXES[8], // index 9-1
                    SUB_AFFIXES[4], // index 5-1
                    SUB_AFFIXES[6], // index 7-1
                ],
                subAffixLevels: [1, 2, 2, 4],
                subAffixSteps: [1, 2, 2, 4],
            });

            expect(result[6]).toEqual({
                relicId: 63116,
                level: 15,
                mainAffix: MAIN_AFFIXES[6][3], // slot 6, index 4-1
                subAffixes: [
                    SUB_AFFIXES[7], // index 8-1
                    SUB_AFFIXES[8], // index 9-1
                    SUB_AFFIXES[6], // index 7-1
                    SUB_AFFIXES[10], // index 11-1
                ],
                subAffixLevels: [3, 3, 2, 1],
                subAffixSteps: [3, 3, 2, 1],
            });

            // Additional structural checks
            expect(Object.keys(result).length).toBe(6); // Should have 6 slots
        });
    });

    describe('parsePropList', () => {
        it('should correctly parse prop list response', () => {
            // Arrange
            const mockResponse =
                `434-300001[13672]: maze_jigsaw 103012 TriggerEnable:10 (Closed:0,Open:1,Locked:2,TriggerDisable:9,TriggerEnable:10,Hidden:20)
434-300002[13672]: ordinary 103109 Closed:0 (Closed:0,Open:1,Locked:2,TriggerDisable:9,TriggerEnable:10)
479-300001[20385]: treasure_chest 60301 ChestClosed:12 (ChestLocked:11,ChestClosed:12,ChestUsed:13,Hidden:20)
184-300002[22475]: ordinary 211 Open:1 (Closed:0,Open:1,Locked:2)
38-300002[30864]: door 103011 Closed:0 (Closed:0,Open:1,Locked:2)`;

            // Act
            const result = CommandService.parsePropList(mockResponse);

            // Assert
            expect(result).toHaveLength(5);

            expect(result[0]).toEqual({
                groupId: 434,
                entityId: 300001,
                distance: 13672,
                type: 'maze_jigsaw',
                propId: 103012,
                state: 'TriggerEnable',
                stateId: 10,
                validStates: {
                    'Closed': 0,
                    'Open': 1,
                    'Locked': 2,
                    'TriggerDisable': 9,
                    'TriggerEnable': 10,
                    'Hidden': 20
                }
            });

            expect(result[1]).toEqual({
                groupId: 434,
                entityId: 300002,
                distance: 13672,
                type: 'ordinary',
                propId: 103109,
                state: 'Closed',
                stateId: 0,
                validStates: {
                    'Closed': 0,
                    'Open': 1,
                    'Locked': 2,
                    'TriggerDisable': 9,
                    'TriggerEnable': 10,
                }
            });

            expect(result[2]).toEqual({
                groupId: 479,
                entityId: 300001,
                distance: 20385,
                type: 'treasure_chest',
                propId: 60301,
                state: 'ChestClosed',
                stateId: 12,
                validStates: {
                    'ChestLocked': 11,
                    'ChestClosed': 12,
                    'ChestUsed': 13,
                    'Hidden': 20
                }
            });

            expect(result[3]).toEqual({
                groupId: 184,
                entityId: 300002,
                distance: 22475,
                type: 'ordinary',
                propId: 211,
                state: 'Open',
                stateId: 1,
                validStates: {
                    'Closed': 0,
                    'Open': 1,
                    'Locked': 2
                }
            });

            expect(result[4]).toEqual({
                groupId: 38,
                entityId: 300002,
                distance: 30864,
                type: 'door',
                propId: 103011,
                state: 'Closed',
                stateId: 0,
                validStates: {
                    'Closed': 0,
                    'Open': 1,
                    'Locked': 2
                }
            });
        });
    });
}); 