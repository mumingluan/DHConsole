import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InventoryIcon from '@mui/icons-material/Inventory';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TerminalIcon from '@mui/icons-material/Terminal';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { DialogsProvider } from '@toolpad/core/useDialogs';
import { Outlet } from 'react-router';
import type { Navigation } from '@toolpad/core';
import { lightTheme, darkTheme } from './theme';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Manage Game Data',
  },
  {
    segment: 'characters',
    title: 'Characters',
    icon: <PeopleIcon />,
  },
  {
    segment: 'missions',
    title: 'Missions',
    icon: <AssignmentIcon />,
  },
  {
    segment: 'inventory',
    title: 'Inventory',
    icon: <InventoryIcon />,
  },
  {
    segment: 'account',
    title: 'Account',
    icon: <AccountCircleIcon />,
  },
  {
    segment: 'command',
    title: 'Command',
    icon: <TerminalIcon />,
  },
];

const BRANDING = {
  title: 'DH Console',
};

export default function App() {
  return (
    <DialogsProvider>
      <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING} theme={{ light: lightTheme, dark: darkTheme }}>
        <Outlet />
      </ReactRouterAppProvider>
    </DialogsProvider>
  );
}
