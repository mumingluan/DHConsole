import * as React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import BasicInfoSection from './sections/BasicInfoSection';
import LightConeSection from './sections/LightConeSection';
import RelicsSection from './sections/RelicsSection';
import CommandService from '../../api/CommandService';
import { Character } from '../../api/CharacterInfo';

interface CharacterDetailsProps {
    characterId: number;
}

export default function CharacterDetails({ characterId }: CharacterDetailsProps) {
    const [characterInfo, setCharacterInfo] = React.useState<Character | null>(null);

    React.useEffect(() => {
        loadCharacterInfo();
    }, [characterId]);

    const loadCharacterInfo = async () => {
        try {
            const info = await CommandService.getCharacterInfo(characterId);
            setCharacterInfo(info);
        } catch (error) {
            console.error('Failed to load character info:', error);
        }
    };

    if (!characterInfo) {
        return <Typography>Pick a character to view details</Typography>;
    }

    return (
        <Box display="flex" flexDirection="column" minHeight="100%">
            <BasicInfoSection
                characterId={characterId}
                characterInfo={characterInfo}
                onUpdate={loadCharacterInfo}
            />
            <Divider sx={{ my: 2 }} />
            <LightConeSection
                characterId={characterId}
                characterInfo={characterInfo}
                onUpdate={loadCharacterInfo}
            />
            <Divider sx={{ my: 2 }} />
            <RelicsSection
                characterId={characterId}
                characterInfo={characterInfo}
                onUpdate={loadCharacterInfo}
            />
        </Box>
    );
} 