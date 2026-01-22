import React, { useState } from 'react';
import MiniDrawer from '../components/MiniDrawer';
import { Box, Tabs, Tab, Button, Modal } from '@mui/material';
import { useAuth } from '../contexts/authContext';
import LocationsTab from '../components/LocationsTab';
import LocationForm from '../components/locationform';
import EntityTab from '../components/EntityTab';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
        </div>
    );
}

const Locations = () => {
    const [value, setValue] = useState(0);
    const [refresh, setRefresh] = useState(0);
    const [openForm, setOpenForm] = useState(false);
    const { role } = useAuth();

    const handleLocationSaved = () => {
        setRefresh(prev => prev + 1);
        setOpenForm(false);
    };

    return (
        <MiniDrawer>
            <h1>Location Management</h1>

            {/* <Button 
                variant="contained" 
                color="primary" 
                onClick={() => setOpenForm(true)} 
                sx={{ mb: 2 }}
            >
                Add Location
            </Button> */}

            <Tabs value={value} onChange={(e, v) => setValue(v)}>
                <Tab label="All Locations" />
                {["SUPER ADMIN", "ADMIN"].includes(role) && (
                    <Tab label="Entities" />
                )}
            </Tabs>

            <TabPanel value={value} index={0}>
                <LocationsTab refresh={refresh} />
            </TabPanel>

            {["SUPER ADMIN", "ADMIN"].includes(role) && (
                <TabPanel value={value} index={1}>
                    <EntityTab />
                </TabPanel>
            )}

            <Modal open={openForm} onClose={() => setOpenForm(false)}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    p: 4, borderRadius: 2, width: 400
                }}>
                    <LocationForm onLocationSaved={handleLocationSaved} />
                </Box>
            </Modal>
        </MiniDrawer>
    );
};

export default Locations;
