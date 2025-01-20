import * as React from 'react';
import { useState, useEffect } from 'react';
import { TextField, Button, Typography, Card, CardContent, IconButton, List, ListItem, ListItemText, Box, Divider, Dialog, DialogTitle, DialogActions, DialogContent } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CommandService from '../api/CommandService';
import GameData from '../store/gameData';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLanguageContext } from '../store/languageContext';
import { usePlayerContext } from '../store/playerContext';
import { useDialogs, DialogProps } from '@toolpad/core/useDialogs';

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Record<number, string>>({});
  const [sendItemCounts, setSendItemCounts] = useState<Record<number, number>>({});
  const [items, setItems] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const { language } = useLanguageContext();
  const { playerUid, isConnected } = usePlayerContext();
  const dialogs = useDialogs();
  var allItems: Record<number, string> = {};

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      await GameData.loadItem(language);
      setLoading(false);
    };
    if (!isConnected) {
      return;
    }
    fetchInventory();
  }, [language, isConnected]);

  const fetchItems = async () => {
    if (!isConnected) {
      return;
    }
    const inventory = await CommandService.getInventory();
    setItems(inventory);
  };

  useEffect(() => {
    fetchItems();
  }, [playerUid, isConnected]);

  const handleSearch = () => {
    if (searchTerm === '') {
      setSearchResults({});
      return;
    }
    var allItems = GameData.getAllItems(language);
    const searchResults = Object.entries(allItems).filter(([, name]) =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(Object.fromEntries(searchResults));
    setSendItemCounts(Object.fromEntries(searchResults.map(([id,]) => [id, 1])));
  };

  const handleSendItem = async (itemId: number, count: number) => {
    await CommandService.giveItem(itemId, count);
  };

  function confirmRemoval({ payload, open, onClose }: DialogProps<string, boolean>) {
    return <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>Are you sure you want to remove all unused {payload}?</DialogTitle>
      <DialogContent>This will remove all {payload} that no characters currently equip.</DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button onClick={() => onClose(true)}>Confirm</Button>
      </DialogActions>
    </Dialog>
  }

  const handleRemoveEquipment = async () => {
    const confirmed = await dialogs.open(confirmRemoval, 'light cones');
    if (confirmed) {
      await CommandService.removeUnusedEquipment();
    }
  };

  const handleRemoveRelics = async () => {
    const confirmed = await dialogs.open(confirmRemoval, 'relics');
    if (confirmed) {
      await CommandService.removeUnusedRelics();
    }
  };

  return (
    <Box>
      <Box style={{ display: 'flex', justifyContent: 'end', gap: '20px', alignItems: 'center' }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleRemoveRelics}
          startIcon={<DeleteIcon />}
          sx={{ textTransform: 'none' }}>
          Remove Unused Relics
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleRemoveEquipment}
          startIcon={<DeleteIcon />}
          sx={{ textTransform: 'none' }}>
          Remove Unused Equipment
        </Button>
      </Box>
      <Typography variant="h6">Send Items</Typography>
      <Box style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', maxWidth: '60%' }}>
        <TextField
          fullWidth
          label="Search Items"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <IconButton onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
      </Box>
      <List dense={true} sx={{ minHeight: '100px' }}>
        {Object.entries(searchResults).map(([id, name]) => (
          <ListItem key={id} secondaryAction={
            <React.Fragment>
              <TextField
                type="number"
                label="Count"
                value={sendItemCounts[Number(id)]}
                onChange={(e) => setSendItemCounts({ ...sendItemCounts, [Number(id)]: Number(e.target.value) })}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleSendItem(Number(id), sendItemCounts[Number(id)])}
                disabled={loading}>
                Send
              </Button>
            </React.Fragment>
          }>
            <ListItemText primary={name} secondary={id} />
          </ListItem>
        ))}
      </List>

      <Divider style={{ margin: '16px 0' }} />
      <Typography variant="h6">Inventory</Typography>
      <Grid container spacing={2}>
        {Object.entries(items).map(([id, count]) => (
          <Grid key={id} size={3}>
            <Card>
              <CardContent>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                  <Typography variant="h6">{GameData.get(Number(id), language)}</Typography>
                  <Typography variant="body2" color="text.secondary">{id}</Typography>
                </div>
                <Typography variant="body1" style={{ marginLeft: '10px' }}>x{count}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}