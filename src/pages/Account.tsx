import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Stack,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Male, Female } from '@mui/icons-material';
import CommandService from '../api/CommandService';
import { usePlayerContext } from '../store/playerContext';
import { useLanguageContext } from '../store/languageContext';

export default function Account() {
  const [playerInfo, setPlayerInfo] = useState<{ level: number; gender: number }>({ level: 1, gender: 1 });
  const [editLevel, setEditLevel] = useState<string>('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const { playerUid, isConnected } = usePlayerContext();
  const { language } = useLanguageContext();

  useEffect(() => {
    loadPlayerInfo();
  }, [playerUid, isConnected]);

  const loadPlayerInfo = async () => {
    try {
      const info = await CommandService.getPlayerInfo();
      setPlayerInfo(info);
      setEditLevel(info.level.toString());
    } catch (error) {
      showSnackbar('Failed to load player info', 'error');
    }
  };

  const handleLevelChange = async () => {
    try {
      const newLevel = parseInt(editLevel, 10);
      if (newLevel < 1 || newLevel > 80) {
        throw new Error('Level must be between 1 and 80');
      }
      await CommandService.setPlayerLevel(newLevel);
      setPlayerInfo(prev => ({ ...prev, level: newLevel }));
      showSnackbar('Level updated successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to update level', 'error');
    }
  };

  const handleGenderChange = async (_: React.MouseEvent<HTMLElement>, newGender: number) => {
    if (newGender === null) return; // Prevent deselection
    try {
      await CommandService.setPlayerGender(newGender);
      setPlayerInfo(prev => ({ ...prev, gender: newGender }));
      showSnackbar('Gender updated successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to update gender', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleUnlockAction = async (action: () => Promise<void>, successMessage: string) => {
    try {
      await action();
      showSnackbar(successMessage, 'success');
    } catch (error) {
      showSnackbar('Action failed', 'error');
    }
  };

  return (
    <Box sx={{ width: 600, margin: '0 auto', p: 3 }}>
      {/* Player Info Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Player Info
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box display="flex" justifyContent="space-around" alignItems="center">
            <Box>
              <Stack spacing={2}>
                <Typography variant="subtitle1">Level</Typography>
                <Stack direction="row" spacing={2}>
                  <TextField
                    size="small"
                    sx={{ width: 80 }} // Increased width to make it appear longer
                    value={editLevel}
                    onChange={(e) => setEditLevel(e.target.value)}
                    type="number"
                    inputProps={{ min: 1, max: 80 }}
                  />
                  <Button variant="contained" onClick={handleLevelChange}>
                    Update
                  </Button>
                </Stack>
              </Stack>
            </Box>

            <Box>
              <Stack spacing={2}>
                <Typography variant="subtitle1">Gender</Typography>
                <ToggleButtonGroup
                  size="small"
                  value={playerInfo.gender}
                  exclusive
                  onChange={handleGenderChange}
                  aria-label="gender"
                >
                  <ToggleButton value={1} aria-label="male">
                    <Male sx={{ mr: 1 }} /> Male
                  </ToggleButton>
                  <ToggleButton value={2} aria-label="female">
                    <Female sx={{ mr: 1 }} /> Female
                  </ToggleButton>
                </ToggleButtonGroup>
              </Stack>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Account Controls Section */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Account Controls
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Stack spacing={3}>
            <Typography variant="h6" sx={{ mb: 2 }}>Unlock All</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleUnlockAction(CommandService.unlockAllCharacters, 'All characters unlocked')}
                  sx={{ textTransform: 'none' }}
                >
                  Characters
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleUnlockAction(CommandService.unlockAllCollectibles, 'All collectibles unlocked')}
                  sx={{ textTransform: 'none' }}
                >
                  Collectibles
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleUnlockAction(CommandService.unlockAllFurniture, 'All furniture unlocked')}
                  sx={{ textTransform: 'none' }}
                >
                  Furniture
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleUnlockAction(CommandService.unlockAllPets, 'All pets unlocked')}
                  sx={{ textTransform: 'none' }}
                >
                  Pets
                </Button>
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Max All</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleUnlockAction(CommandService.setAllCharactersMaxLevel, 'All characters set to max level')}
                  sx={{ textTransform: 'none' }}
                >
                  Character Level
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleUnlockAction(CommandService.setAllCharactersMaxRank, 'All characters set to max rank')}
                  sx={{ textTransform: 'none' }}
                >
                  Character Rank
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleUnlockAction(CommandService.setAllCharactersMaxTalent, 'All characters set to max talent')}
                  sx={{ textTransform: 'none' }}
                >
                  Character Talent
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}