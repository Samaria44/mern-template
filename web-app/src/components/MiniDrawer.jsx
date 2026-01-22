import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Toolbar, List, CssBaseline, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Chip } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import { Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DynamicBreadcrumbs from './DynamicBreadcrumbs';
import LogoutIcon from '@mui/icons-material/Logout';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Footer } from './Footer';
import { navItems } from '../constants/NaveItems';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authServices';
import { useAuth } from '../contexts/authContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Menu, MenuItem } from '@mui/material';
import Logo from "../assets/logo.png";
import User from "../assets/user.png";
import screenfull from "screenfull";


const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function MiniDrawer({ children }) {
    const navigate = useNavigate()
    const theme = useTheme();
    const { user, userName, role, logout, permissions } = useAuth();
    const [open, setOpen] = React.useState(false);
    const [menuAnchor, setMenuAnchor] = React.useState(null);

    const [isFullscreen, setIsFullscreen] = React.useState(true);

    const toggleFullscreen = () => {
        if (screenfull.isEnabled) {
            screenfull.toggle();
            setIsFullscreen(screenfull.isFullscreen);
        }
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    function hasPermission(param, permissions) {
        // Check if the provided parameter exists in the object
        if (['home', 'profile', 'setting', 'entity',location].includes(param)) {
            return true;
        } else {
            // const permissions = getPermissions();
            if (permissions.hasOwnProperty(param)) {
                // console.log("param",param);
                const permission = permissions[param];
                // Check if at least one of the properties is true
                return permission.create || permission.read || permission.update || permission.delete;
            }
            return false;
        }
    }

    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Dashboard
                    </Typography>

                    {/* <Avatar
                        sx={{ bgcolor: lightBlue[500] }}
                        alt="Remy Sharp"
                        src="/broken-image.jpg"
                    >
                        B
                    </Avatar> */}
                    <IconButton
                        sx={{ ml: 1 }}
                        onClick={toggleFullscreen}
                        color="inherit"
                    >
                        {isFullscreen ? <FullscreenIcon /> : <FullscreenExitIcon />}
                    </IconButton>
                    <Chip
                        label={userName ? userName : "user"}
                        icon={<AccountCircleIcon style={{ color: "#fff" }} />}
                        style={{ color: "#fff", overflow: "hidden" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setMenuAnchor(e.currentTarget);
                        }}
                    />
                    <Menu
                        anchorEl={menuAnchor}
                        open={Boolean(menuAnchor)}
                        onClose={() => setMenuAnchor(null)}
                        // transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        PaperProps={{
                            sx: {
                                backgroundColor: '#fff',
                                border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.light}`,
                                borderRadius: 1,
                                width: 100,
                                minWidth: 200,
                            },
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                            <Avatar
                                sx={{
                                    bgcolor: theme.palette.primary.main,
                                    width: 64,
                                    height: 64,

                                }}
                            >
                                <AccountCircleIcon sx={{ fontSize: 32 }} />
                            </Avatar>
                            <Typography variant="h6" sx={{
                                // color: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.main,
                                fontWeight: 'bold',
                            }}>
                                {userName || "user"}
                            </Typography>
                            <Typography variant="subtitle2" sx={{
                                // color: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.main,

                            }}>
                                {role || 'Admin'}
                            </Typography>
                        </Box>
                        <Divider sx={{
                            borderColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.main,
                            mb: 1,
                        }} />
                        <MenuItem onClick={() => {
                            authService.logout();
                            logout();
                            navigate("/");
                        }}>
                            <ListItemIcon>
                                <LogoutIcon style={{ color: theme.palette.primary.main }} />
                            </ListItemIcon>
                            <Typography variant="body2" sx={{
                                color: theme.palette.primary.main,
                                fontWeight: 'bold',
                            }}>
                                Logout
                            </Typography>
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderTop: 1,
                    borderColor: theme.palette.divider,
                    bgcolor: theme.palette.background.paper,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 1.75,
                    py: 0.5,
                    mt: 'auto'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            src={user?.profilePicture || User}
                            sx={{
                                bgcolor: theme.palette.primary.main,
                                width: 35,
                                height: 35,
                                mr: 2
                            }}
                        />
                        <Box>
                            <Typography variant="subtitle2" color="text.primary">
                                {userName || 'User'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {role || 'User'}
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton
                        color="inherit"
                        onClick={logout}
                        size="small"
                    >
                        <LogoutIcon />
                    </IconButton>
                </Box>
                <DrawerHeader>
                    <Box style={{ width: "100%", display: "flex", justifyContent: "center" }} >
                        <img src={Logo} alt="logo" style={{ width: "70px", ...(!open && { display: 'none' }) }} />
                    </Box>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {navItems.map((navItem, index) => (
                        hasPermission(navItem.entity, permissions) && <Link to={navItem.url} key={index} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <ListItem disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    className="main-list-item"
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                        m: 1,
                                        borderRadius: 2,
                                        color: (currentPath === navItem.url && '#fff'),
                                        backgroundColor: currentPath === navItem.url ? theme.palette.primary.main : 'transparent',
                                        // '&:hover': {
                                        //     backgroundColor: theme.palette.primary.main,
                                        //     color: "#fff",
                                        // },
                                    }}
                                >
                                    <ListItemIcon
                                        className='list-icons'
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                            '& .MuiSvgIcon-root': {
                                                color: currentPath === navItem.url && '#fff'
                                            },
                                            // '&:hover': {
                                            //     color: '#fff'
                                            // },
                                        }}
                                    >
                                        {<navItem.icon />}
                                    </ListItemIcon>
                                    <ListItemText primary={navItem.title} sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>
                        </Link>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, width: "80%" }}>
                <DrawerHeader />
                <Box sx={{ p: 3, flexGrow: 1, mb: 5 }}>
                    <DynamicBreadcrumbs />
                    {children}
                </Box>
                <Footer />
            </Box>
        </Box>
    );
}
