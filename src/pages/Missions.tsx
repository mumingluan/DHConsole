import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Chip, List, ListItem, ListItemText, Divider, TextField, IconButton } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import CommandService from '../api/CommandService';
import GameData, { GameEntity } from '../store/gameData';

const missionCategories = [
  { label: 'Main Story', prefix: '1', icon: 'Book' },
  { label: 'Side Story', prefix: '2', icon: 'LocalLibrary' },
  { label: 'Companion Story', prefix: '3', icon: 'People' },
  { label: 'Daily Quest', prefix: '4', icon: 'Event' },
  { label: 'Other Missions', prefix: '5', icon: 'Assignment' },
  { label: 'Event Quests', prefix: '8', icon: 'Star' },
];

const Missions = () => {
  const [currentMissions, setCurrentMissions] = useState<Record<number, number[]>>({});
  const [completedMainMissions, setCompletedMainMissions] = useState<string[]>([]);
  const [completedSubMissions, setCompletedSubMissions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Record<string, number>>({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    // Fetch current missions from CommandService
    const fetchMissions = async () => {
      const missions = await CommandService.getCurrentMissions();
      setCurrentMissions(missions);
    };
    fetchMissions();
  }, []);

  const handleCompleteSubMission = (subMissionId: number) => {
    CommandService.finishSubMission(subMissionId);
    setCompletedSubMissions((prev) => [...prev, subMissionId.toString()]);
    setCurrentMissions((prev) => {
      const updated = { ...prev };
      delete updated[subMissionId];
      return updated;
    });
  };

  const handleCompleteMainMission = (mainMissionId: number) => {
    CommandService.finishMainMission(mainMissionId);
    setCompletedMainMissions((prev) => [...prev, mainMissionId.toString()]);
    setCurrentMissions((prev) => {
      const updated = { ...prev };
      delete updated[mainMissionId];
      return updated;
    });
  };
  

  const handleAcceptMission = (missionId: number) => {
    CommandService.acceptMainMission(missionId);
  };

  const handleSearch = () => {
    const results = GameData.getAllMainMissions();
    const filteredResults = Object.entries(results).filter(([name]) =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
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
    selectedCategories.length === 0 || selectedCategories.some((category) => id.startsWith(category))
  );

  return (
    <Box display="flex" height="100%">
      {/* Left Panel: Current Missions */}
      <Box flex={1} padding={2} borderRight="1px solid #ccc">
        <Typography variant="h6">Current Missions</Typography>
        <Box display="flex" flexWrap="wrap" marginBottom={2}>
          {missionCategories.map((category) => (
            <Chip
              key={category.prefix}
              label={category.label}
              onClick={() => toggleCategory(category.prefix)}
              color={selectedCategories.includes(category.prefix) ? 'primary' : 'default'}
              style={{ margin: 4 }}
            />
          ))}
        </Box>
        <List>
          {filteredMissions.map(([mainMissionId, subMissions]) => (
            <React.Fragment key={mainMissionId}>
              <ListItem>
                <ListItemText primary={GameData.get(Number(mainMissionId))} />
                <Box display="flex" justifyContent="flex-end">
                  <Button variant="contained" color="secondary" onClick={() => handleCompleteMainMission(Number(mainMissionId))}>
                    Complete All
                  </Button>
                </Box>
              </ListItem>
              {subMissions.map((subMissionId) => (
                <ListItem key={subMissionId} style={{ marginLeft: '16px' }}>
                  <ListItemText primary={GameData.get(subMissionId)} />
                  <Box display="flex" justifyContent="flex-end">
                    <Button variant="contained" color="secondary" onClick={() => handleCompleteSubMission(subMissionId)}>
                      Complete
                    </Button>
                  </Box>
                </ListItem>
              ))}
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Right Panel: Accept Missions */}
      <Box flex={1} padding={2}>
        <Typography variant="h6">Accept Missions</Typography>
        <Typography variant="subtitle1">Recently Completed</Typography>
        <List>
          {completedMainMissions.map((id) => (
            <ListItem key={id}>
              <ListItemText primary={GameData.get(Number(id))} />
              <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" color="primary" onClick={() => handleAcceptMission(Number(id))}>
                  Reaccept
                </Button>
              </Box>
            </ListItem>
          ))}
          {completedSubMissions.map((id) => (
            <ListItem key={id}>
              <ListItemText primary={GameData.get(Number(id))} />
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
          {Object.entries(searchResults).map(([name, id]) => (
            <ListItem key={id}>
              <ListItemText primary={name} />
              <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" color="primary" onClick={() => handleAcceptMission(id)}>
                  Accept
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Missions;