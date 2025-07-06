import * as React from 'react';
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGrid, GridToolbar, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton } from '@mui/x-data-grid';
import { Box, Button, ButtonGroup, Grid, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BuildIcon from '@mui/icons-material/Build';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAuth } from '../contexts/authContext';
import { hasActionPermission, hasEntityPermission } from '../utils/helperFunctions';
import LinearProgress from '@mui/material/LinearProgress';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { GridToolbarExport } from '@mui/x-data-grid';
import { GridToolbarColumnsButton } from '@mui/x-data-grid';
import PublishIcon from '@mui/icons-material/Publish';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function ControledDataGrid({ entity, columns, tableData = [], handleEditClick, handleDeleteClick, action, view = false, link = false, actionAllow, handleActionClick, handleLinkProjectClick, handleViewClick = () => console.log("view"), handleViewMapClick = () => console.log("map"), allowMap = false }) {
  const { permissions, userName, user } = useAuth();

  // console.log("permissions", permissions);
  const updatedColumns = [
    (hasActionPermission(entity, permissions) && {
      field: 'actions',
      headerName: 'Actions',
      headerAlign: "center",
      align: "center",
      width: 180,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <ButtonGroup variant="text" color="primary" aria-label="text primary button group" sx={{ mt: 1 }}>
          {(hasEntityPermission('read', entity, permissions) || hasEntityPermission('read_self', entity, permissions)) && view && <IconButton aria-label="view" onClick={() => handleViewClick(params.row)}>
            <Tooltip title="read" placement="bottom">
              <VisibilityIcon fontSize="small" />
            </Tooltip>
          </IconButton>}
          {hasEntityPermission('update', entity, permissions) && <IconButton aria-label="edit" onClick={() => handleEditClick(params.row)}>
            <Tooltip title="update" placement="bottom">
              <EditIcon fontSize="small" />
            </Tooltip>
          </IconButton>}
          {hasEntityPermission('update', entity, permissions) && actionAllow && <IconButton aria-label="action" onClick={() => handleActionClick(params.row)}>
            <Tooltip title="update status" placement="bottom">
              <BuildIcon fontSize="small" />
            </Tooltip>
          </IconButton>}
          {hasEntityPermission('delete', entity, permissions) && <IconButton aria-label="delete" onClick={() => handleDeleteClick(params.row._id)}>
            <Tooltip title="delete" placement="bottom">
              <DeleteIcon fontSize="small" />
            </Tooltip>
          </IconButton>}
        </ButtonGroup>
      ),
    }),
    ...columns,
  ];

  return (
    <Grid container spacing={2} style={{ height: '65vh' }}>
      <Grid item xs={12}>
        <DataGrid
          rows={tableData}
          columns={action ? updatedColumns : columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row._id}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      </Grid>
    </Grid>
  );
}