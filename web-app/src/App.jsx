
import Router from './routes/Router'
import * as React from 'react';
import ColorModeProvider, { useColorMode } from './contexts/colorModeContext';
import ThemeConfig from './styles/ThemeConfig';
import { SnackbarContent, SnackbarProvider } from 'notistack';
import { useAuth } from './contexts/authContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useTheme } from '@mui/material';

// const ColorModeContext = React.createContext({ toggleColorMode: () => { } });

export default function App() {

  const theme = useTheme();
  
  return (
    <ColorModeProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SnackbarProvider maxSnack={3} anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}>
          <Router />
        </SnackbarProvider>
      </LocalizationProvider>
    </ColorModeProvider>
  );
}

