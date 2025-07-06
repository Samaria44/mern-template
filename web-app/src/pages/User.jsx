import React, { useState } from 'react';
import MiniDrawer from '../components/MiniDrawer';
import { Box, Tabs, Tab } from '@mui/material';
import { useAuth } from '../contexts/authContext';
import UsersTab from '../components/UsersTab';
import LoginLogsTab from '../components/LoginLogsTab';
import EntityTab from '../components/EntityTab';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 2 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export const Users = () => {
    const [value, setValue] = useState(0);
    const { role } = useAuth();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <MiniDrawer>
            <h1>Users Management</h1>
            <Box sx={{ width: '100%'}}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="users management tabs">
                        <Tab label="Users" {...a11yProps(0)} />
                        {["SUPER ADMIN", "ADMIN"].includes(role) && (
                            <Tab label="Login Logs" {...a11yProps(1)} />
                        )}
                        {["SUPER ADMIN", "ADMIN"].includes(role) && (
                            <Tab label="Entities" {...a11yProps(2)} />
                        )}
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <UsersTab />
                </TabPanel>
                {["SUPER ADMIN", "ADMIN"].includes(role) && (
                    <TabPanel value={value} index={1}>
                        <LoginLogsTab />
                    </TabPanel>
                )}
                {["SUPER ADMIN", "ADMIN"].includes(role) && (
                    <TabPanel value={value} index={2}>
                        <EntityTab />
                    </TabPanel>
                )}
            </Box>
        </MiniDrawer>
    );
};