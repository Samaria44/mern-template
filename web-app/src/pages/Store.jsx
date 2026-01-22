import React, { useState } from 'react';
import MiniDrawer from '../components/MiniDrawer';
import { Box, Tabs, Tab, Button, Modal } from '@mui/material';
import { useAuth } from '../contexts/authContext';
import StoreTab from '../components/StoreTab';
import StoreForm from '../components/Storeform';

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

const Store = () => {
    const [value, setValue] = useState(0);
    const [openForm, setOpenForm] = useState(false);
    const { role } = useAuth();

    const handleStoreSaved = () => {
        setOpenForm(false);
    };

    return (
        <MiniDrawer>
            <h1>Store Management</h1>

            <Tabs value={value} onChange={(e, v) => setValue(v)}>
                <Tab label="All Store Items" />
            </Tabs>

            <TabPanel value={value} index={0}>
                <StoreTab />
            </TabPanel>

            <Modal open={openForm} onClose={() => setOpenForm(false)}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    p: 4, borderRadius: 2, width: 400
                }}>
                    <StoreForm onStoreSaved={handleStoreSaved} />
                </Box>
            </Modal>
        </MiniDrawer>
    );
};

export default Store;

