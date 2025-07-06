import { useTheme } from "@emotion/react";
import { useColorMode } from "../contexts/colorModeContext";
import { IconButton } from "@mui/material";
import Box from '@mui/material/Box';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export function ModeToggle() {
    // const theme = useTheme();
    const { mode, toggleColorMode } = useColorMode();
    return (
        <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
    );
}