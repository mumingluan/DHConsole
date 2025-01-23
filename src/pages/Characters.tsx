import * as React from 'react';
import { Box, Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';
import CharacterList from '../components/characters/CharacterList';
import CharacterDetails from '../components/characters/CharacterDetails';

export default function Characters() {
  const { t } = useTranslation();
  const [selectedCharacterId, setSelectedCharacterId] = React.useState<number | null>(null);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={3}>
          <Paper sx={{ height: 'calc(100vh - 80px)', overflow: 'auto' }}>
            <CharacterList
              selectedCharacterId={selectedCharacterId}
              onCharacterSelect={setSelectedCharacterId}
            />
          </Paper>
        </Grid>
        <Grid size={9}>
          <Paper sx={{ p: 2, minHeight: 'calc(100vh - 80px)', overflow: 'auto' }}>
            {selectedCharacterId ? (
              <CharacterDetails characterId={selectedCharacterId} />
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  {t('character.selectPrompt')}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}