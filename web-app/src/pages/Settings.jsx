import React from 'react'
import MiniDrawer from '../components/MiniDrawer'
import { Box, Tab, Tabs, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import ChangePassword from '../components/ChangePassword';
import Profile from './Profile';

export const Settings = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <MiniDrawer>
      <h1>Settings</h1>

      <Box
        sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 500 }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: 'divider' }}
        >
          <Tab label="Profile" {...a11yProps(0)} />
          <Tab label="Change Password" {...a11yProps(1)} />
          {/* <Tab label="Item Three" {...a11yProps(2)} /> */}
        </Tabs>
        <TabPanel value={value} index={0}>
          <Profile />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ChangePassword />
        </TabPanel>
        {/* <TabPanel value={value} index={2}>
        Item Three
      </TabPanel> */}
      </Box>
    </MiniDrawer>
  )
}
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}