import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';

import { useColorMode } from '../contexts/colorModeContext';
import { darkTheme, lightTheme } from './theme';

// const getTheme = (mode) => createTheme({
//     palette: {
//         mode,
//         ...(mode === 'light' ? lightTheme : darkTheme),
//     },
// });
const getTheme = (mode) => createTheme({
    palette: {
      primary: {
        // main: '#9E2D3B', // Replace with your desired primary color
        main: '#50413C', // Replace with your desired primary color
      },
      secondary: {
        main: '#4CAF50', // Optional: Define a secondary color if needed
      },
    },
  });

export default function ThemeConfig({ children }) {
    const { mode } = useColorMode();
    const theme = React.useMemo(() => getTheme(mode), [mode]);

    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
}
