import React, { useEffect } from 'react';
import { Button, Select, MenuItem, Typography, Box } from '@mui/material';
import { ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import MuipService from '../api/MuipService';
import CommandService from '../api/CommandService';
import { usePlayerContext } from '../store/playerContext';

interface ServerState {
  isConnected: boolean;
  players: { uid: number; name: string }[];
  serverTime: string;
  serverMemory: string;
}

const ServerToolbarActions = () => {
  const { playerUid, setPlayerUid } = usePlayerContext();
  const [state, setState] = React.useState<ServerState>({
    isConnected: false,
    players: [],
    serverTime: '',
    serverMemory: '',
  });

  const fetchServerInfo = async () => {
    try {
      const serverInfo = await MuipService.getServerInformation();
      setState((prevState) => ({
        ...prevState,
        players: serverInfo.onlinePlayers,
        serverTime: new Date(serverInfo.serverTime * 1000).toLocaleString([], { hour: '2-digit', minute: '2-digit' }),
        serverMemory: `${(serverInfo.programUsedMemory).toFixed(2)} MB`,
      }));

      if (serverInfo.onlinePlayers.length > 0) {
        setPlayerUid(serverInfo.onlinePlayers[0].uid);
      }
    } catch (error) {
      console.error('Error fetching server information:', error);
      setState((prevState) => ({ ...prevState, isConnected: false }));
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state.isConnected) {
      interval = setInterval(fetchServerInfo, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [state.isConnected]);

  const handleConnect = async () => {
    try {
      await fetchServerInfo();
      setState((prevState) => ({ ...prevState, isConnected: true }));
    } catch (error) {
      console.error('Connection failed:', error);
      setState((prevState) => ({ ...prevState, isConnected: false }));
    }
  };

  const updatePlayerUid = (uid: number) => {
    CommandService.setPlayerUid(uid);
    setPlayerUid(uid);
  }

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Select
        value={playerUid || ''}
        onChange={(e) => updatePlayerUid(Number(e.target.value))}
        disabled={!state.isConnected}
        displayEmpty
        sx={{ height: '45px', padding: '0 14px', boxSizing: 'border-box' }}
      >
        <MenuItem value="" disabled>
          {state.isConnected ? 'Select a player' : '(disconnected)'}
        </MenuItem>
        {state.players.map((player) => (
          <MenuItem key={player.uid} value={player.uid}>
            {player.name} ({player.uid})
          </MenuItem>
        ))}
      </Select>

      <Button
        variant="contained"
        color="primary"
        onClick={handleConnect}
        disabled={state.isConnected}
      >
        {state.isConnected ? 'Connected' : 'Connect'}
      </Button>

      <Typography variant="body1">
        Server Time: {state.serverTime || '--'}
      </Typography>

      <Typography variant="body1">
        Memory Used: {state.serverMemory || '--'}
      </Typography>

      <Box marginLeft="auto">
        <ThemeSwitcher />
      </Box>
    </Box>
  );
};

export default ServerToolbarActions;
