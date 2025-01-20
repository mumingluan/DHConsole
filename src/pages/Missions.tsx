import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Chip, List, ListItem, ListItemText, Divider, TextField, IconButton, ListItemButton, ListItemIcon, ListItemSecondaryAction } from '@mui/material';
import { Search as SearchIcon, Refresh as RefreshIcon, Assignment as AssignmentIcon } from '@mui/icons-material';
import CommandService from '../api/CommandService';
import GameData from '../store/gameData';
import { useLanguageContext } from '../store/languageContext';
import { usePlayerContext } from '../store/playerContext';

const missionCategories = [
  { label: 'Main Story', prefix: '1', icon: 'Book' },
  { label: 'Side Story', prefix: '2|5|6|7', icon: 'LocalLibrary' },
  { label: 'World', prefix: '4', icon: 'Map' },
  { label: 'Daily', prefix: '3', icon: 'Event' },
  { label: 'Event', prefix: '8', icon: 'Star' },
];

const Missions = () => {
  const [currentMissions, setCurrentMissions] = useState<Record<number, number[]>>({});
  const [completedMainMissions, setCompletedMainMissions] = useState<number[]>([]);
  const [completedSubMissions, setCompletedSubMissions] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Record<number, string>>({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { language } = useLanguageContext();
  const { playerUid, isConnected } = usePlayerContext();

  useEffect(() => {
    setLoading(true);
    GameData.loadMainMission(language);
    GameData.loadSubMission(language);
    setLoading(false);
  }, [language, isConnected]);

  const fetchMissions = async () => {
    if (!isConnected) {
      return;
    }
    const missions = await CommandService.getCurrentMissions();
    setCurrentMissions(missions);
    console.log(missions);
    const mainMissionIds = Object.keys(missions).map(Number);
    setCompletedMainMissions((prev) => prev.filter(id => !mainMissionIds.includes(id)));
    const subMissionIds = Object.values(missions).flat();
    setCompletedSubMissions((prev) => prev.filter(id => !subMissionIds.includes(id)));
  };

  useEffect(() => {
    fetchMissions();
  }, [playerUid, isConnected]);

  const handleCompleteSubMission = (subMissionId: number) => {
    CommandService.finishSubMission(subMissionId);
    setCompletedSubMissions((prev) => [...prev, subMissionId]);
    fetchMissions();
  };

  const handleCompleteMainMission = (mainMissionId: number) => {
    CommandService.finishMainMission(mainMissionId);
    setCompletedMainMissions((prev) => [...prev, mainMissionId]);
    fetchMissions();
  };
  

  const handleAcceptMission = (missionId: number) => {
    CommandService.acceptMainMission(missionId);
    fetchMissions();
  };

  const handleSearch = () => {
    const results = GameData.getAllMainMissions(language);
    const filteredResults = Object.entries(results).filter(([, value]) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(Object.fromEntries(filteredResults));
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredMissions = Object.entries(currentMissions).filter(([id]) =>
    selectedCategories.length === 0 || selectedCategories.some((category) => category.includes(id[0]))
  );

  const missionCounts = missionCategories.map(category => ({
    label: category.label,
    count: Object.keys(currentMissions).filter(([id]) => category.prefix.includes(id[0])).length,
  }));

  return (
    <Box display="flex" height="100%">
      <Box flex={1} padding={2} borderRight="1px solid #ccc">
        <Box display="flex" alignItems="center">
          <Typography variant="h6">Current Missions</Typography>
          <IconButton color="primary" onClick={fetchMissions} style={{ marginLeft: 2 }}>
            <RefreshIcon />
          </IconButton>
        </Box>
        <Box display="flex" flexWrap="wrap" marginBottom={2}>
          {missionCategories.map((category) => (
            <Chip
              key={category.label}
              label={`${category.label} (${missionCounts.find(count => count.label === category.label)?.count || 0})`}
              onClick={() => toggleCategory(category.prefix)}
              color={selectedCategories.includes(category.prefix) ? 'primary' : 'default'}
              style={{ margin: 4 }}
            />
          ))}
        </Box>
        <List dense={true}>
          {filteredMissions.map(([mainMissionId, subMissions]) => (
            <React.Fragment key={mainMissionId}>
              <ListItem secondaryAction={
                <Button color="secondary" onClick={() => handleCompleteMainMission(Number(mainMissionId))}>
                  Complete All
                </Button>
              } >
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary={`${GameData.get(Number(mainMissionId), language)}`} secondary={`(${mainMissionId})`} />
              </ListItem>
              {subMissions.map((subMissionId) => (
                <ListItem key={subMissionId} style={{ marginLeft: '48px' }} secondaryAction={
                  <Button color="secondary" onClick={() => handleCompleteSubMission(subMissionId)}>
                    Complete
                  </Button>
                } >
                  <ListItemText primary={`${GameData.get(Number(subMissionId), language)}`} secondary={`(${subMissionId})`} />
                </ListItem>
              ))}
            </React.Fragment>
          ))}
        </List>
      </Box>

      <Box flex={1} padding={2}>
        <Typography variant="h6">Accept New Missions</Typography>
        <Typography variant="subtitle1">Recently Completed</Typography>
        <List>
          {completedMainMissions.map((id) => (
            <ListItem key={id} secondaryAction={
              <Button color="secondary" onClick={() => handleAcceptMission(Number(id))}>
                Reaccept
              </Button>
            } >
              <ListItemText primary={`${GameData.get(Number(id), language)}`} secondary={`(${id} main)`} />
            </ListItem>
          ))}
          {completedSubMissions.map((id) => (
            <ListItem key={id}>
              <ListItemText primary={`${GameData.get(Number(id), language)}`} secondary={`(${id} sub)`} />
            </ListItem>
          ))}
        </List>
        <Divider style={{ margin: '16px 0' }} />
        <Typography variant="subtitle1">Search Missions</Typography>
        <Box display="flex" alignItems="center" marginBottom={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search missions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IconButton onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
        </Box>
        <List>
          {Object.entries(searchResults).map(([id, name]) => (
            <ListItem key={id}>
              <ListItemText primary={name} />
              <ListItemButton onClick={() => handleAcceptMission(Number(id))}>
                Accept
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Missions;