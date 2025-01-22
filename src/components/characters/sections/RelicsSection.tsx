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
    ButtonGroup,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import EditIcon from '@mui/icons-material/Edit';
import { Character, Relic, MAIN_AFFIXES, SUB_AFFIXES, RELIC_NAMES } from '../../../api/CharacterInfo';
import CommandService from '../../../api/CommandService';
import GameData from '../../../store/gameData';
import { useLanguageContext } from '../../../store/languageContext';

interface RelicSectionProps {
    characterId: number;
    characterInfo: Character;
    onUpdate: () => void;
}

interface RelicCardProps {
    pos: number;
    relic: Relic;
    isEditing: boolean;
    onRelicChange: (pos: number, relic: Relic) => void;
}

interface AffixRowProps {
    pos: number;
    label: string;
    affix: string;
    level: number;
    isEditable: boolean;
    isMain?: boolean;
    onAffixChange?: (affix: string) => void;
    onLevelChange?: (level: number) => void;
    maxLevel?: number;
    availableLevels?: number;
}

function AffixRow({
    pos,
    label,
    affix,
    level,
    isEditable,
    isMain,
    onAffixChange,
    onLevelChange,
    availableLevels = 5
}: AffixRowProps) {
    const { language } = useLanguageContext();
    const possibleAffixes = isMain ? MAIN_AFFIXES[pos] : SUB_AFFIXES;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isEditable ? (
                <TextField
                    select
                    size="small"
                    value={affix || ''}
                    onChange={(e) => onAffixChange?.(e.target.value)}
                    sx={{ flexGrow: 1 }}
                >
                    {possibleAffixes.map((name) => (
                        <MenuItem key={name} value={name}>
                            {name}
                        </MenuItem>
                    ))}
                </TextField>
            ) : (
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        [{label}] {affix || '<Empty>'}
                </Typography>
            )}
            {isEditable && !isMain ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 120 }}>
                    <ButtonGroup>
                        <Button
                            size="small"
                            sx={{ padding: '0 4px', width: '12px' }}
                            onClick={() => {
                                const newLevel = Math.max(level - 1, 0);
                                onLevelChange?.(newLevel);
                            }}
                        >
                            -
                        </Button>
                        <TextField
                            type="number"
                            size="small"
                            value={level}
                            onChange={(e) => {
                                const newLevel = Math.max(0, Math.min(Number(e.target.value), availableLevels));
                                onLevelChange?.(newLevel);
                            }}
                            inputProps={{ min: 0, max: availableLevels }}
                            sx={{ width: 40 }}
                        />
                        <Button
                            size="small"
                            sx={{ padding: '0 4px', width: '12px' }}
                            onClick={() => {
                                const newLevel = Math.min(level + 1, availableLevels);
                                onLevelChange?.(newLevel);
                            }}
                        >
                            +
                        </Button>
                    </ButtonGroup>
                </Box>
            ) : (
                <Typography variant="body2" sx={{ width: 80, textAlign: 'right' }}>
                        {isMain ? 'Lv. ' : '+ '} {level}
                </Typography>
            )}
        </Box>
    );
}

function RelicCard({ pos: index, relic, isEditing, onRelicChange }: RelicCardProps) {
    const { language } = useLanguageContext();
    const [mainAffix, setMainAffix] = React.useState<string>(relic.mainAffix || '');
    const [subAffixes, setSubAffixes] = React.useState<Array<{ name: string; level: number }>>([
        { name: relic.subAffixes?.[0] || '', level: relic.subAffixLevels?.[0] || 0 },
        { name: relic.subAffixes?.[1] || '', level: relic.subAffixLevels?.[1] || 0 },
        { name: relic.subAffixes?.[2] || '', level: relic.subAffixLevels?.[2] || 0 },
        { name: relic.subAffixes?.[3] || '', level: relic.subAffixLevels?.[3] || 0 },
    ]);

    const totalSubAffixLevels = subAffixes.reduce((sum, affix) => sum + affix.level, 0);
    const availableLevels = 5 - totalSubAffixLevels;

    const handleSubAffixChange = (index: number, field: 'name' | 'level', value: string | number) => {
        const newSubAffixes = [...subAffixes];
        newSubAffixes[index] = { ...newSubAffixes[index], [field]: value };
        setSubAffixes(newSubAffixes);

        onRelicChange(index, {
            ...relic,
            subAffixes: newSubAffixes.map(a => a.name),
            subAffixLevels: newSubAffixes.map(a => a.level),
        });
    };

    const handleMainAffixChange = (value: string) => {
        setMainAffix(value);
        onRelicChange(index, {
            ...relic,
            mainAffix: value,
        });
    };

    return (
        <Card variant="outlined">
            <CardContent sx={{ padding: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                    {RELIC_NAMES[index]}
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
                        {Object.entries(GameData.getAllItems(language))
                            .filter(([id]) => { return Number(id) > 60000 && Number(id) < 70000 }) // Filter for relic items
                            .map(([id, name]) => (
                                <MenuItem key={id} value={id}>
                                    {name}
                                </MenuItem>
                            ))}
                    </TextField>

                    <Divider />

                    <AffixRow
                        pos={index}
                        label="Main"
                        affix={mainAffix}

                        level={relic.level || 15} // Fixed level for main affix
                        isEditable={isEditing && index > 2}
                        isMain={true}
                    />

                    <Divider />

                    {subAffixes.map((subAffix, subIndex) => (
                        <AffixRow
                            pos={index}
                            key={subIndex}
                            label="Sub"
                            affix={subAffix.name}
                            level={subAffix.level}
                            isEditable={isEditing}
                            onAffixChange={(name) => handleSubAffixChange(subIndex, 'name', name)}
                            onLevelChange={(level) => handleSubAffixChange(subIndex, 'level', level)}
                            availableLevels={availableLevels + subAffix.level}
                        />
                    ))}

                    {isEditing && totalSubAffixLevels > 5 && (
                        <Typography color="error" variant="caption">
                            Total sub affix upgrade levels cannot exceed 5 (current: {totalSubAffixLevels})
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

    React.useEffect(() => {
        setRelics(characterInfo.relics || {});
    }, [characterInfo]);

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
                {Array.from([1, 2, 3, 4, 5, 6], (i) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={i}>
                        <RelicCard
                            pos={i}
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