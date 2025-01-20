import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context state
interface PlayerContextState {
  playerUid: number | null;
  setPlayerUid: (uid: number) => void;
  isConnected: boolean;
  setIsConnected: (isConnected: boolean) => void;
}

// Create the context with a default value
const PlayerContext = createContext<PlayerContextState | undefined>(undefined);

// Create a provider component
export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [playerUid, setPlayerUid] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  return (
    <PlayerContext.Provider value={{ playerUid, setPlayerUid, isConnected, setIsConnected }}>
      {children}
    </PlayerContext.Provider>
  );
};

// Custom hook to use the PlayerContext
export const usePlayerContext = (): PlayerContextState => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }
  return context;
}; 