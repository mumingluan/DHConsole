import * as React from 'react';
import {
    Box,
    Typography,
    IconButton,
    TextField,
    Button,
    Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { CharacterInfo } from '../../../api/CharacterInfo';
import CommandService from '../../../api/CommandService';

interface BasicInfoSectionProps {
    characterId: number;
    characterInfo: CharacterInfo;
    onUpdate: () => void;
}

export default function BasicInfoSection({ characterId, characterInfo, onUpdate }: BasicInfoSectionProps) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [level, setLevel] = React.useState(characterInfo.level || 1);
    const [rank, setRank] = React.useState(characterInfo.rank || 0);
    const [talent, setTalent] = React.useState(1);

    const handleSave = async () => {
        try {
            await CommandService.setCharacterBasicInfo(characterId, level, rank, talent);
            onUpdate();
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to save basic info:', error);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Basic Information</Typography>
                <IconButton size="small" onClick={() => setIsEditing(!isEditing)} sx={{ ml: 1 }}>
                    <EditIcon />
                </IconButton>
            </Box>

            {isEditing ? (
                <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        label="Level"
                        type="number"
                        value={level}
                        onChange={(e) => setLevel(Number(e.target.value))}
                        inputProps={{ min: 1, max: 80 }}
                        size="small"
                    />
                    <TextField
                        label="Eidolon"
                        type="number"
                        value={rank}
                        onChange={(e) => setRank(Number(e.target.value))}
                        inputProps={{ min: 0, max: 6 }}
                        size="small"
                    />
                    <TextField
                        label="Talent Level"
                        type="number"
                        value={talent}
                        onChange={(e) => setTalent(Number(e.target.value))}
                        inputProps={{ min: 1, max: 10 }}
                        size="small"
                    />
                    <Button variant="contained" onClick={handleSave} size="small">
                        Save
                    </Button>
                </Box>
            ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 2, flexWrap: 'wrap' }}>
                    <Typography>Level: {characterInfo.level}</Typography>
                    <Typography>Rank: {characterInfo.rank}</Typography>
                    <Typography>
                        Talents: {Object.entries(characterInfo.talent || {})
                            .map(([key, value]) => `${value}`)
                            .join(', ')}
                    </Typography>
                    </Box>
            )}
        </Box>
    );
} 