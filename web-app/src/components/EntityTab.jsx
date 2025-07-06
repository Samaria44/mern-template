import React, { useEffect, useState } from 'react';
import ControledDataGrid from './ControledDataGrid';
import { Box, Button, TextField, LinearProgress, Switch } from '@mui/material';
import ScrollDialog from './Dialog';
import { convertUtcToLocal, hasEntityPermission } from '../utils/helperFunctions';
import { useAuth } from '../contexts/authContext';
import { useSnackbar } from 'notistack';
import EntityForm from './EntityForm';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchEntities,
    createEntity,
    updateEntity,
    deleteEntity,
    toggleEntityStatus,
    setSelectedEntity,
    resetEntityState
} from '../features/Slicers/entitySlice';

const EntityTab = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { permissions } = useAuth();
    const { entities, loading, error, selectedEntity } = useSelector(state => state.entity);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [data, setData] = useState(null);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setData(null);
    };

    const handleEditClick = async (rowData) => {
        setData(rowData);
        handleOpenModal();
    };

    const handleDeleteClick = async (rowId) => {
        if (rowId !== "") {
            if (confirm("This Entity will be permanently deleted?")) {
                try {
                    await dispatch(deleteEntity(rowId));
                    enqueueSnackbar("Entity Deleted Successfully!!", { variant: 'success' });
                } catch (error) {
                    enqueueSnackbar(error.message, { variant: 'error' });
                }
            }
        }
    };

    const handleStatusChange = async (entityData) => {
        try {
            await dispatch(toggleEntityStatus({ id: entityData._id, active: !entityData.active }));
            enqueueSnackbar('Status updated successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
        }
    };

    const handleSubmitForm = async (entityData) => {
        try {
            if (entityData._id) {
                await dispatch(updateEntity({ id: entityData._id, entityData }));
                enqueueSnackbar("Entity Updated Successfully!!", { variant: 'success' });
            } else {
                await dispatch(createEntity(entityData));
                enqueueSnackbar("Entity Added Successfully!!", { variant: 'success' });
            }
            handleCloseModal();
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
        }
    };

    const fetchEntitiesData = async () => {
        try {
            await dispatch(fetchEntities());
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredEntities = entities && Array.isArray(entities)
        ? entities.filter((entity) => {
            const query = searchQuery.toLowerCase();
            return (
                entity.name.toLowerCase().includes(query) ||
                entity.description.toLowerCase().includes(query) ||
                entity.type.toLowerCase().includes(query)
            );
        })
        : [];

    const columns = [
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'description', headerName: 'Description', width: 300 },
        { field: 'type', headerName: 'Type', width: 150 },
        { field: 'created_at', headerName: 'Created At', width: 150, valueFormatter: (params) => convertUtcToLocal(params)},
        { field: 'created_by', headerName: 'Created By', width: 150 },
        {
            field: 'active',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => (
                <Switch
                    checked={params.row.active}
                    onChange={() => handleStatusChange(params.row)}
                    color="primary"
                />
            )
        }
    ];

    useEffect(() => {
        fetchEntitiesData();
    }, []);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                {/* <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenModal}
                        sx={{ mb: 2, mr: 2 }}
                    >
                        Add Entity
                    </Button> */}
                <TextField
                    id="search"
                    label="Search Entities"
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{ width: 300 }}
                />
                {/* </Box> */}
                <Box>
                    {hasEntityPermission('create', 'entity', permissions) && (
                        <ScrollDialog
                            title={"Entity"}
                            form={<EntityForm submitHandler={handleSubmitForm} data={data} />}
                            data={data}
                            modalOpen={modalOpen}
                            handleOpenModal={handleOpenModal}
                            handleCloseModal={handleCloseModal}
                        />
                    )}
                    <ScrollDialog
                        title={"Entity"}
                        form={<EntityForm submitHandler={handleSubmitForm} data={data} />}
                        data={data}
                        modalOpen={modalOpen}
                        handleOpenModal={handleOpenModal}
                        handleCloseModal={handleCloseModal}
                    />
                    <Button
                        sx={{ ml: 1, mb: 2 }}
                        onClick={fetchEntitiesData}
                        variant="contained"
                    >
                        Refresh
                    </Button>
                </Box>
            </Box>
            <LinearProgress sx={{ display: loading === false && "none" }} />
            {entities && (
                <ControledDataGrid
                    entity={'entity'}
                    tableData={filteredEntities}
                    columns={columns}
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDeleteClick}
                    action={true}
                />
            )}
            {error && (
                <Box sx={{ color: 'error.main', mt: 2 }}>
                    {error}
                </Box>
            )}
        </Box>
    );
};

export default EntityTab;
