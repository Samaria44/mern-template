import React, { useEffect, useState } from 'react';
import ControledDataGrid from './ControledDataGrid';
import { Box, Button, TextField, Switch } from '@mui/material';

import ScrollDialog from './Dialog';
import { userService } from '../services/userServices';
import { convertUtcToLocal, hasEntityPermission } from '../utils/helperFunctions';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAuth } from '../contexts/authContext';
import { useSnackbar } from 'notistack';
import UserForm from './UserForm';

const UsersTab = () => {
    const [users, setUsers] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [data, setData] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [statusChangeLoading, setStatusChangeLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const { permissions } = useAuth();

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
            if (confirm("This User will be permanently deleted?")) {
                const response = await userService.deleteUsers(rowId);
                if (response) {
                    enqueueSnackbar("User Deleted Successfully!!", { variant: 'success' });
                    setUsers((prevUsers) => prevUsers.filter(user => user._id !== rowId));
                }
            }
        }
    };

    const handleStatusChange = async (userData) => {
        setStatusChangeLoading(true);
        try {
            await userService.updateUserStatus(userData._id, { active: !userData.active });
            fetchUser();
            enqueueSnackbar('Status updated successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
        } finally {
            setStatusChangeLoading(false);
        }
    };

    const handleSubmitForm = async (userData) => {
        if (userData._id) {
            const response = await userService.updateUser(userData._id, userData);
            if (response.status == 201) {
                setUsers((prevUsers) => prevUsers.map(user => user._id === userData._id ? response.data : user));
                handleCloseModal();
                enqueueSnackbar("User Updated Successfully!!", { variant: 'success' });
            } else {
                enqueueSnackbar(response.response.data.message, { variant: 'error' });
            }
        } else {
            const { _id, ...userDataWithoutId } = userData;
            const response = await userService.createUser(userDataWithoutId);
            if (response.status == 201) {
                setUsers((prevUsers) => [...prevUsers, response.data]);
                handleCloseModal();
                enqueueSnackbar("User Added Successfully!!", { variant: 'success' });
            } else {
                enqueueSnackbar(response.response.data.message, { variant: 'error' });
            }
        }
    };

    const fetchUser = async () => {
        try {
            setLoading(true);
            const response = await userService.getUsers();
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredUsers = users
        ? users.filter((user) => {
            const query = searchQuery.toLowerCase();
            return (
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                user.username.toLowerCase().includes(query)
            );
        })
        : [];

    const columns = [
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'username', headerName: 'Username', width: 150 },
        { field: 'number', headerName: 'Number', width: 150 },
        { field: 'cnic', headerName: 'CNIC', width: 150 },
        { field: 'department_name', headerName: 'Department', width: 150 },
        { field: 'location_name', headerName: 'Location', width: 150 },
        { field: 'role', headerName: 'Role', width: 150 },
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
        },
        { field: 'created_at', headerName: 'Created At', width: 150, valueGetter: (params) => params.value ? new Date(params.value).toLocaleDateString() : '' },
        {
            field: 'last_login',
            headerName: 'Last Login',
            width: 200,
            align: "center",
            headerAlign: 'center',
            valueFormatter: (params) => convertUtcToLocal(params)
        },
    ];

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <TextField
                    id="search"
                    label="Search Users"
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{ width: 300 }}
                />
                <Box>
                    {hasEntityPermission('create', 'user', permissions) && (
                        <ScrollDialog
                            title={"User"}
                            form={<UserForm submitHandler={handleSubmitForm} data={data} />}
                            data={data}
                            modalOpen={modalOpen}
                            handleOpenModal={handleOpenModal}
                            handleCloseModal={handleCloseModal}
                        />
                    )}
                    <Button
                        sx={{ ml: 1, mb: 2 }}
                        onClick={fetchUser}
                        variant="contained"
                        startIcon={<RefreshIcon />}
                    >
                        Refresh
                    </Button>
                </Box>
            </Box>
            {users && (
                <ControledDataGrid
                    entity={'user'}
                    tableData={filteredUsers}
                    columns={columns}
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDeleteClick}
                    action={true}
                    loading={loading}
                />
            )}
        </Box>
    );
};

export default UsersTab;