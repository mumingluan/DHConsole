import * as React from 'react';
import {
    Box,
    Typography,
    IconButton,
    Card,
    CardContent,
    TextField,
    Button,
    Stack,
    MenuItem,
    Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import EditIcon from '@mui/icons-material/Edit';
import { CharacterInfo, Relic } from '../../../api/CharacterInfo';
import CommandService from '../../../api/CommandService';
import GameData from '../../../store/gameData';
import { useLanguageContext } from '../../../store/languageContext';

interface RelicSectionProps {
    characterId: number;
    characterInfo: CharacterInfo;
    onUpdate: () => void;
}

interface RelicCardProps {
    index: number;
    relic: Relic;
    isEditing: boolean;
    onRelicChange: (index: number, relic: Relic) => void;
}

interface AffixRowProps {
    label: string;
    affixId: number;
    level: number;
    isEditable: boolean;
    isMain?: boolean;
    onAffixChange?: (id: number) => void;
    onLevelChange?: (level: number) => void;
    maxLevel?: number;
    availableLevels?: number;
}

function AffixRow({
    label,
    affixId,
    level,
    isEditable,
    isMain,
    onAffixChange,
    onLevelChange,
    maxLevel = 3,
    availableLevels = 3
}: AffixRowProps) {
    const { language } = useLanguageContext();

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isEditable && !isMain ? (
                <TextField
                    select
                    size="small"
                    value={affixId || ''}
                    onChange={(e) => onAffixChange?.(Number(e.target.value))}
                    sx={{ flexGrow: 1 }}
                >
                    {/* Replace with actual affix IDs */}
                    {[1, 2, 3, 4, 5].map((id) => (
                        <MenuItem key={id} value={id}>
                            {GameData.get(id, language)}
                        </MenuItem>
                    ))}
                </TextField>
            ) : (
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    {label}: {affixId ? GameData.get(affixId, language) : 'Empty'}
                </Typography>
            )}
            {isEditable && !isMain ? (
                <TextField
                    type="number"
                    size="small"
                    value={level}
                    onChange={(e) => {
                        const newLevel = Math.min(Number(e.target.value), maxLevel);
                        if (newLevel <= availableLevels) {
                            onLevelChange?.(newLevel);
                        }
                    }}
                    inputProps={{ min: 1, max: Math.min(maxLevel, availableLevels) }}
                    sx={{ width: 80 }}
                />
            ) : (
                <Typography variant="body2" sx={{ width: 80, textAlign: 'right' }}>
                    Lv. {level}
                </Typography>
            )}
        </Box>
    );
}

function RelicCard({ index, relic, isEditing, onRelicChange }: RelicCardProps) {
    const { language } = useLanguageContext();
    const [subAffixes, setSubAffixes] = React.useState<Array<{ id: number; level: number }>>([
        { id: relic.subAffixIds?.[0] || 0, level: relic.subAffixLevels?.[0] || 1 },
        { id: relic.subAffixIds?.[1] || 0, level: relic.subAffixLevels?.[1] || 1 },
        { id: relic.subAffixIds?.[2] || 0, level: relic.subAffixLevels?.[2] || 1 },
        { id: relic.subAffixIds?.[3] || 0, level: relic.subAffixLevels?.[3] || 1 },
    ]);

    const totalSubAffixLevels = subAffixes.reduce((sum, affix) => sum + affix.level, 0);
    const availableLevels = 9 - totalSubAffixLevels;

    const handleSubAffixChange = (index: number, field: 'id' | 'level', value: number) => {
        const newSubAffixes = [...subAffixes];
        newSubAffixes[index] = { ...newSubAffixes[index], [field]: value };
        setSubAffixes(newSubAffixes);

        // Update the parent component
        onRelicChange(index, {
            ...relic,
            subAffixIds: newSubAffixes.map(a => a.id),
            subAffixLevels: newSubAffixes.map(a => a.level),
        });
    };

    // Get main affix ID based on relic position
    const getMainAffixId = () => {
        if (index === 0 || index === 1) return 1;
        // Add logic for other positions if needed
        return relic.mainAffixId || 1;
    };

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                    Relic {index + 1}
                </Typography>
                <Stack spacing={2}>
                    <TextField
                        select
                        size="small"
                        label="Relic"
                        value={relic.relicId || ''}
                        onChange={(e) => onRelicChange(index, { ...relic, relicId: Number(e.target.value) })}
                        disabled={!isEditing}
                        fullWidth
                    >
                        {Object.entries(GameData.getAllItems(language)).map(([id, name]) => (
                            <MenuItem key={id} value={id}>
                                {name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        size="small"
                        type="number"
                        label="Level"
                        value={relic.level || 0}
                        onChange={(e) => onRelicChange(index, { ...relic, level: Number(e.target.value) })}
                        disabled={!isEditing}
                        inputProps={{ min: 0, max: 15 }}
                    />

                    <Divider />

                    {/* Main Affix */}
                    <AffixRow
                        label="Main"
                        affixId={getMainAffixId()}
                        level={15}
                        isEditable={false}
                        isMain={true}
                    />

                    <Divider />

                    {/* Sub Affixes */}
                    {subAffixes.map((subAffix, subIndex) => (
                        <AffixRow
                            key={subIndex}
                            label={`Sub ${subIndex + 1}`}
                            affixId={subAffix.id}
                            level={subAffix.level}
                            isEditable={isEditing}
                            onAffixChange={(id) => handleSubAffixChange(subIndex, 'id', id)}
                            onLevelChange={(level) => handleSubAffixChange(subIndex, 'level', level)}
                            availableLevels={availableLevels + subAffix.level}
                        />
                    ))}

                    {isEditing && totalSubAffixLevels > 9 && (
                        <Typography color="error" variant="caption">
                            Total sub affix levels cannot exceed 9 (current: {totalSubAffixLevels})
                        </Typography>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}

export default function RelicsSection({ characterId, characterInfo, onUpdate }: RelicSectionProps) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [relics, setRelics] = React.useState<Record<number, Relic>>(characterInfo.relics || {});

    const handleRelicChange = (index: number, relic: Relic) => {
        setRelics(prev => ({ ...prev, [index]: relic }));
    };

    const handleSave = async () => {
        try {
            await CommandService.setCharacterRelic(characterId, relics);
            onUpdate();
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to save relics:', error);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Relics</Typography>
                <IconButton size="small" onClick={() => setIsEditing(!isEditing)} sx={{ ml: 1 }}>
                    <EditIcon />
                </IconButton>
            </Box>

            <Grid container spacing={2}>
                {Array.from({ length: 6 }, (_, i) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={i}>
                        <RelicCard
                            index={i}
                            relic={relics[i] || {}}
                            isEditing={isEditing}
                            onRelicChange={handleRelicChange}
                        />
                    </Grid>
                ))}
            </Grid>

            {isEditing && (
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" onClick={handleSave} fullWidth>
                        Save All Relics
                    </Button>
                </Box>
            )}
        </Box>
    );
}