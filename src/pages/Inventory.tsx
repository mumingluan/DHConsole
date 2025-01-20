import * as React from 'react';
import { useState, useEffect } from 'react';
import { TextField, Button, Typography, Card, CardContent, IconButton, List, ListItem, ListItemText } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CommandService from '../api/CommandService';
import GameData from '../store/gameData';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLanguageContext } from '../store/languageContext';
import { usePlayerContext } from '../store/playerContext';

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Record<number, string>>({});
  const [sendItemCounts, setSendItemCounts] = useState<Record<number, number>>({});
  const [items, setItems] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const { language } = useLanguageContext();
  const { playerUid, isConnected } = usePlayerContext();
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

  const handleRemoveUnusedEquipment = async () => {
    await CommandService.removeUnusedEquipment();
  };

  const handleRemoveUnusedRelics = async () => {
    await CommandService.removeUnusedRelics();
  };

  return (
    <div>

      <div style={{ display: 'flex', justifyContent: 'end', gap: '20px', alignItems: 'center' }}>
        <Button variant="contained" color="secondary" onClick={handleRemoveUnusedEquipment} startIcon={<DeleteIcon />}>
          Remove Unused Equipment
        </Button>
        <Button variant="contained" color="secondary" onClick={handleRemoveUnusedRelics} startIcon={<DeleteIcon />}>
          Remove Unused Relics
        </Button>
      </div>
      <Typography variant="h6">Send Items</Typography>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <TextField
          label="Search Items"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <IconButton onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
      </div>
      <List dense={true}>
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
    </div>
  );
}