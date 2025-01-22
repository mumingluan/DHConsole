import React from 'react';
import {
    Box,
    Typography,
    IconButton,
    TextField,
    Button,
    MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Character } from '../../../api/CharacterInfo';
import CommandService from '../../../api/CommandService';
import GameData from '../../../store/gameData';
import { useLanguageContext } from '../../../store/languageContext';

interface LightConeSectionProps {
    characterId: number;
    characterInfo: Character;
    onUpdate: () => void;
}

export default function LightConeSection({ characterId, characterInfo, onUpdate }: LightConeSectionProps) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [equipId, setEquipId] = React.useState(characterInfo.equipId || 0);
    const [equipLevel, setEquipLevel] = React.useState(characterInfo.equipLevel || 1);
    const [equipRank, setEquipRank] = React.useState(characterInfo.equipRank || 1);
    const { language } = useLanguageContext();

    const handleSave = async () => {
        try {
            await CommandService.setCharacterEquip(characterId, equipId, equipLevel, equipRank);
            onUpdate();
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to save light cone info:', error);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Light Cone</Typography>
                <IconButton size="small" onClick={() => setIsEditing(!isEditing)} sx={{ ml: 1 }}>
                    <EditIcon />
                </IconButton>
            </Box>

            {isEditing ? (
                <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        select
                        label="Light Cone"
                        value={equipId}
                        onChange={(e) => setEquipId(Number(e.target.value))}
                        size="small"
                        sx={{ width: '100px' }}
                    >
                        {Object.entries(GameData.getAllItems(language)).map(([id, name]) => (
                            <MenuItem key={id} value={id}>
                                {name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Level"
                        type="number"
                        value={equipLevel}
                        onChange={(e) => setEquipLevel(Number(e.target.value))}
                        inputProps={{ min: 1, max: 80 }}
                        size="small"
                        sx={{ width: '100px' }}
                    />
                    <TextField
                        label="Superimposition"
                        type="number"
                        value={equipRank}
                        onChange={(e) => setEquipRank(Number(e.target.value))}
                        inputProps={{ min: 1, max: 5 }}
                        size="small"
                        sx={{ width: '100px' }}
                    />
                    <Button variant="contained" onClick={handleSave} size="small">
                        Save
                    </Button>
                </Box>
            ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 2, flexWrap: 'wrap', paddingRight: 3 }}>
                        <Typography>
                            Name: {characterInfo.equipId ? GameData.get(characterInfo.equipId, language) : '--'}
                        </Typography>
                        <Typography>Level: {characterInfo.equipLevel || '--'}</Typography>
                        <Typography>Superimposition: {characterInfo.equipRank || '--'}</Typography>
                    </Box>
            )}
        </Box>
    );
} 