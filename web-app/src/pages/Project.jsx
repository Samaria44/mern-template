import React, { useEffect, useState } from 'react';
import MiniDrawer from '../components/MiniDrawer';
import ControledDataGrid from '../components/ControledDataGrid';
import { Box, Button, Grid, LinearProgress, MenuItem, Modal, TextField, Typography } from '@mui/material';
import ScrollDialog from '../components/Dialog';
import { convertUtcToLocal, hasEntityPermission } from '../utils/helperFunctions';
import RefreshIcon from '@mui/icons-material/Refresh';
import { projectService } from '../services/projectServices';
import { useAuth } from '../contexts/authContext';
import { useSnackbar } from 'notistack';
import { CheckCircle, Cancel} from '@mui/icons-material';

export const Project = () => {
    const [devices, setDevices] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [data, setData] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [loading, setLoading] = useState(false);

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
        // Implement edit logic here
        setData(rowData);
        handleOpenModal();
        // console.log('Edit clicked:', rowData);
    };

    const handleDeleteClick = async (rowId) => {
        // console.log('Delete clicked:', rowId);
        if (rowId !== "") {
            if (confirm("This Project will be permanently deleted?")) {
                const response = await projectService.deleteProjects(rowId);
                if (response) {
                    // alert("Device Deleted Successfully");
                    enqueueSnackbar("Project Deleted Sucessfully!!", { variant: 'success' });
                    // Update the devices state to reflect the deletion
                    setDevices((prevDevices) => prevDevices.filter(device => device._id !== rowId));
                }
                // console.log(response);
            }
        }
    };

    const handleSubmitForm = async (deviceData) => {
        // console.log('Device data:', deviceData);
        if (deviceData._id) {
            const response = await projectService.updateProject(deviceData._id, deviceData);
            // console.log("response", response);
            if (response.status == 201) {
                // Update the devices state to reflect the update
                // console.log(response);
                setDevices((prevDevices) => prevDevices.map(device => device._id === deviceData._id ? response.data : device));
                handleCloseModal();
                // alert("Project Updated Successfully");
                enqueueSnackbar("Project Updated Sucessfully!!", { variant: 'success' });
            } else {
                // alert(response.response.data.message);
                enqueueSnackbar(response.response.data.message, { variant: 'error' });

            }
        } else {
            // console.log(deviceData);
            const { _id, ...deviceDataWithoutId } = deviceData;
            const response = await projectService.createProject(deviceDataWithoutId);
            if (response.status == 201) {
                setDevices((prevDevices) => [...prevDevices, response.data]);
                handleCloseModal();
                // alert("Project Added Successfully");
                enqueueSnackbar("Project Added Sucessfully!!", { variant: 'success' });
            } else {
                // alert(response.response.data.message);
                enqueueSnackbar(response.response.data.message, { variant: 'error' });
            }
        }
    };

    const fetchProjects = async () => {
        try {
            setLoading(true)
            const response = await projectService.getProjects();
            // console.log(response);
            setDevices(response.data);
        } catch (error) {
            console.error('Error fetching Projects:', error);
            enqueueSnackbar(error.response.data.message, { variant: 'error' });
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    // const filteredDevices = devices
    //     ? devices
    //         .filter((device) => {
    //             const query = searchQuery.toLowerCase();
    //             return (
    //                 device.name.toLowerCase().includes(query) ||
    //                 device.ip.toLowerCase().includes(query)
    //                 //   device.ip.toLowerCase().includes(query) ||
    //                 //   device.latestLog.mac.toLowerCase().includes(query)
    //             );
    //         })
    //     : [];

    const columns = [
        { field: 'name', headerName: 'Name', width: 400 },
        // { field: 'project', headerName: 'Project', width: 210 },
        // { field: 'state', headerName: 'State', width: 210 },
        {
            field: 'state', headerName: 'State', width: 80, align: "center", headerAlign: 'center',
            renderCell: (params) => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        {params.value == "active" ? (
                            <CheckCircle style={{ color: 'green', fontSize: '20px' }} />
                        ) : (
                            <Cancel style={{ color: 'red', fontSize: '20px' }} />
                        )}
                    </div>
                );
            },
        },
        {
            field: 'created_at', headerName: 'Created at', width: 200, align: "center", headerAlign: 'center',
            valueFormatter: (params) => {
                return convertUtcToLocal(params);
            }
        },
    ];

    return (
        <MiniDrawer>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Projects</h1>
                {/* <TextField
                    id="search"
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={handleSearchChange}
                /> */}
                <Box>
                    {hasEntityPermission('create', 'project', permissions) && <ScrollDialog title={"Project"} form={<Form submitHandler={handleSubmitForm} data={data} />} data={data} modalOpen={modalOpen} handleOpenModal={handleOpenModal} handleCloseModal={handleCloseModal} />}
                    <Button sx={{ mb: 2, ml: 1 }} onClick={fetchProjects} variant="contained" startIcon={<RefreshIcon />}>Refresh</Button>
                </Box>
            </Box>
            <LinearProgress sx={{ display: loading == false && "none" }} />
            {devices && <ControledDataGrid entity={'project'} tableData={devices} columns={columns} handleEditClick={handleEditClick} handleDeleteClick={handleDeleteClick} action={true} />}
        </MiniDrawer>
    );
};



const Form = ({ submitHandler, data }) => {
    const [formValues, setFormValues] = useState({
        _id: '',
        name: '',
        state: ''
    });

    useEffect(() => {
        if (data) {
            setFormValues(data);
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitHandler(formValues);
    };

    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { my: 1, width: '100%' },
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
        >
            <TextField id="_id" label="ID" variant="outlined" size="small" fullWidth value={formValues._id} onChange={handleChange} sx={{ display: "none" }} />
            <TextField name="name" label="Name" variant="outlined" size="small" fullWidth value={formValues.name} onChange={handleChange} />
            <TextField
                name="state"
                select
                size="small"
                label="state"
                sx={{ width: "100%" }}
                value={formValues.state}
                onChange={handleChange}
            >
                <MenuItem value="">---select---</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
            <Button type="submit" variant="contained" size="small" sx={{ mt: 2 }}>{data ? "Update" : "Add"}</Button>
        </Box>
    );
};

export default Form;