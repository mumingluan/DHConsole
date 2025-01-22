import React, { useEffect } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    TextField,
    Button,
    MenuItem,
} from '@mui/material';
import CommandService from '../../api/CommandService';
import { useLanguageContext } from '../../store/languageContext';
import { usePlayerContext } from '../../store/playerContext';
import GameData from '../../store/gameData';

interface CharacterListProps {
    selectedCharacterId: number | null;
    onCharacterSelect: (characterId: number) => void;
}

export default function CharacterList({ selectedCharacterId, onCharacterSelect }: CharacterListProps) {
    const [ownedCharacters, setOwnedCharacters] = React.useState<number[]>([]);
    const [newCharacterId, setNewCharacterId] = React.useState<number>(0);
    const [loading, setLoading] = React.useState<boolean>(false);
    const { language } = useLanguageContext();
    const { playerUid, isConnected } = usePlayerContext();

    useEffect(() => {
        const fetchCharacters = async () => {
            setLoading(true);
            await Promise.all([GameData.loadCharacter(language), GameData.loadItem(language)]);
            setLoading(false);
        };
        if (!isConnected) {
            return;
        }
        fetchCharacters();
    }, [language, isConnected]);

    const loadOwnedCharacters = async () => {
        try {
            const characters = await CommandService.getOwnedCharacters();
            setOwnedCharacters(characters);
        } catch (error) {
            console.error('Failed to load characters:', error);
        }
    };

    useEffect(() => {
        loadOwnedCharacters();
    }, [playerUid, isConnected]);

    const handleAddCharacter = async () => {
        if (!newCharacterId) return;
        try {
            await CommandService.giveItem(newCharacterId);
            await loadOwnedCharacters();
            setNewCharacterId(0);
        } catch (error) {
            console.error('Failed to add character:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <TextField
                    select
                    fullWidth
                    size="small"
                    value={newCharacterId}
                    onChange={(e) => setNewCharacterId(Number(e.target.value))}
                    label="Add Character"
                    sx={{ mb: 1 }}
                >
                    {ownedCharacters.map((id) => (
                        <MenuItem key={id} value={id}>
                            {GameData.get(id, language)}
                        </MenuItem>
                    ))}
                </TextField>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleAddCharacter}
                    disabled={!newCharacterId}
                >
                    Add Character
                </Button>
            </Box>
            <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                {ownedCharacters.map((characterId) => (
                    <ListItem key={characterId} disablePadding>
                        <ListItemButton
                            selected={characterId === selectedCharacterId}
                            onClick={() => onCharacterSelect(characterId)}
                        >
                            <ListItemText primary={GameData.get(characterId, language)} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
} 