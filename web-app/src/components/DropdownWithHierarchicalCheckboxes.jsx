import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { permissionService } from '../services/permissionServices';
import { useSnackbar } from 'notistack';

// const data = {
//   products: { create: true, read: true, update: true, delete: true },
//   categories: { create: true, read: true, update: true, delete: true },
//   orders: { create: true, read: false, update: true, delete: false },
//   customers: { create: false, read: true, update: false, delete: true }
// };

export default function IndeterminateCheckboxList({ data }) {
  function removeFields(obj) {
    if (obj && typeof obj === 'object' && Object.keys(obj).length > 0) {
      const { _id, userId, __v, ...rest } = obj;
      return rest;
    } else {
      return {};
    }
  }

  const { enqueueSnackbar } = useSnackbar();
  // const [checked, setChecked] = React.useState(removeFields(data));
  const [checked, setChecked] = useState({});

  useEffect(() => {
    if (data) {
      setChecked(removeFields(data));
    }
  }, [data]);
  const [open, setOpen] = React.useState({});

  const handleToggleParent = (parentId) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [parentId]: !prevOpen[parentId]
    }));
  };

  const handleParentChange = (parentId) => {
    const newChecked = { ...checked };
    const allChecked = Object.values(newChecked[parentId]).every(value => value);

    Object.keys(newChecked[parentId]).forEach((key) => {
      newChecked[parentId][key] = !allChecked;
    });

    setChecked(newChecked);
  };

  const handleChildChange = (parentId, childId) => {
    const newChecked = { ...checked };
    newChecked[parentId][childId] = !newChecked[parentId][childId];
    setChecked(newChecked);
  };

  const handleButtonClick = async () => {
    // console.log('Updated Object:', { _id: data._id, ...checked });

    const response = await permissionService.updatePermission(data._id, data);
    if (response.status == 201) {
      // setPermission(response.data);
      // console.log(response.data)
      // alert("Permission Updated Successfully");
      enqueueSnackbar("Permission Updated Successfully", { variant: 'success' })
    } else {
      // alert(response.data.message);
      enqueueSnackbar(response.data.message, { variant: 'error' })
    }
  };

  return (
    <Box>
      <List>
        {Object.keys(checked).map((parent) => (
          <React.Fragment key={parent}>
            <ListItem button onClick={() => handleToggleParent(parent)}>
              <ListItemIcon>
                <Checkbox
                  checked={Object.values(checked[parent]).every(value => value)}
                  indeterminate={
                    !Object.values(checked[parent]).every(value => value) &&
                    Object.values(checked[parent]).some(value => value)
                  }
                  onChange={() => handleParentChange(parent)}
                />
              </ListItemIcon>
              <ListItemText primary={parent.charAt(0).toUpperCase() + parent.slice(1)} />
              {open[parent] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open[parent]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {Object.keys(checked[parent]).map((child) => (
                  <ListItem key={child} sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <Checkbox
                        checked={checked[parent][child]}
                        onChange={() => handleChildChange(parent, child)}
                      />
                    </ListItemIcon>
                    <ListItemText primary={child.charAt(0).toUpperCase() + child.slice(1)} />
                  </ListItem>
                ))}
              </List>
            </Collapse>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <Button variant="contained" color="primary" onClick={handleButtonClick}>
        Save
      </Button>
    </Box>
  );
}
