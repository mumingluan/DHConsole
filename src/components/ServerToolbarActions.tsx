import React, { useEffect } from 'react';
import { Button, Select, MenuItem, Typography, Box } from '@mui/material';
import { ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import MuipService from '../api/MuipService';
import CommandService from '../api/CommandService';
import { usePlayerContext } from '../store/playerContext';

interface ServerState {
  players: { uid: number; name: string }[];
  serverTime: string;
  serverMemory: string;
}

const ServerToolbarActions = () => {
  const { playerUid, setPlayerUid, isConnected, setIsConnected } = usePlayerContext();
  const [state, setState] = React.useState<ServerState>({
    players: [],
    serverTime: '',
    serverMemory: '',
  });

  const fetchServerInfo = async () => {
    try {
      const serverInfo = await MuipService.getServerInformation();
      setState((prevState) => ({
        players: serverInfo.onlinePlayers,
        serverTime: new Date(serverInfo.serverTime * 1000).toLocaleString([], { hour: '2-digit', minute: '2-digit' }),
        serverMemory: `${(serverInfo.programUsedMemory).toFixed(2)} MB`,
      }));

      if (serverInfo.onlinePlayers.length > 0) {
        updatePlayerUid(serverInfo.onlinePlayers[0].uid);
      }
    } catch (error) {
      console.error('Error fetching server information:', error);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isConnected) {
      interval = setInterval(fetchServerInfo, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isConnected]);

  const handleConnect = async () => {
    try {
      await fetchServerInfo();
      setIsConnected(true);
    } catch (error) {
      console.error('Connection failed:', error);
      setIsConnected(false);
      setPlayerUid(0);
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
        disabled={!isConnected}
        displayEmpty
        sx={{ height: '45px', padding: '0 14px', boxSizing: 'border-box' }}
      >
        <MenuItem value="" disabled>
          {isConnected ? 'Select a player' : '(disconnected)'}
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
        disabled={isConnected}
      >
        {isConnected ? 'Connected' : 'Connect'}
      </Button>

      <Box display="flex" flexDirection="column">
        <Typography variant="body2">
          Server Time: {state.serverTime || '--'}
        </Typography>
        <Typography variant="body2">
          Memory Used: {state.serverMemory || '--'}
        </Typography>
      </Box>

      <Box marginLeft="auto">
        <ThemeSwitcher />
      </Box>
    </Box>
  );
};

export default ServerToolbarActions;
