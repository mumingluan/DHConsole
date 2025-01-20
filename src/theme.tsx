import { createTheme, Theme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const lightPalette = {
  primary: {
    main: '#7289da', // vibrant accents
  },
  secondary: {
    main: '#99aab5', // Subdued complementary tone
  },
  background: {
    default: '#f5f5f5', // Light background
    paper: '#ffffff',
  },
  text: {
    primary: '#23272a', // Dark text for contrast
    secondary: '#2c2f33',
  },
};

const darkPalette = {
  primary: {
    main: '#5865f2', // Brighter accent for dark mode
  },
  secondary: {
    main: '#4f545c', // Neutral secondary
  },
  background: {
    default: '#2c2f33', // Dark background
    paper: '#23272a',
  },
  text: {
    primary: '#ffffff', // White text for readability
    secondary: '#99aab5',
  },
};

const commonTypography = {
  fontFamily: '"ZCOOL XiaoWei", serif',
};

export const lightTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    ...lightPalette,
  },
  typography: commonTypography,
});

export const darkTheme: Theme = createTheme({
  palette: {
    mode: 'dark',
    ...darkPalette,
  },
  typography: commonTypography,
});

export const theme: Theme = darkTheme;
