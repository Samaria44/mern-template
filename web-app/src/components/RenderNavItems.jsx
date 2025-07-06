import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { navItems } from '../constants/NaveItems'; // Import the navItems array

const renderNavItems = (items, open, handleToggle) => {
  return items.map((item, index) => (
    <React.Fragment key={index}>
      {item.url ? (
        <Link to={item.url} key={index} style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {React.createElement(item.icon)}
              </ListItemIcon>
              <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </Link>
      ) : (
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
            onClick={() => handleToggle(index)}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              {React.createElement(item.icon)}
            </ListItemIcon>
            <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0 }} />
            {open === index ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          {item.children && (
            <Collapse in={open === index} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderNavItems(item.children, open, handleToggle)}
              </List>
            </Collapse>
          )}
        </ListItem>
      )}
    </React.Fragment>
  ));
};

export default function DynamicNavList() {
  const [open, setOpen] = useState(null);

  const handleToggle = (index) => {
    setOpen(open === index ? null : index);
  };

  return (
    <List>
      {renderNavItems(navItems, open, handleToggle)}
    </List>
  );
}
