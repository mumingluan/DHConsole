import * as React from 'react';
import { Box, Grid, Paper } from '@mui/material';
import CharacterList from '../components/characters/CharacterList';
import CharacterDetails from '../components/characters/CharacterDetails';

export default function Characters() {
  const [selectedCharacterId, setSelectedCharacterId] = React.useState<number | null>(null);

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        <Grid item xs={3}>
          <Paper sx={{ height: '100%', overflow: 'hidden' }}>
            <CharacterList
              selectedCharacterId={selectedCharacterId}
              onCharacterSelect={setSelectedCharacterId}
            />
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <Paper sx={{ height: '100%', overflow: 'auto', p: 2 }}>
            {selectedCharacterId ? (
              <CharacterDetails characterId={selectedCharacterId} />
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                Select a character to view details
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}