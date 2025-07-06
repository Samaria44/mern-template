import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, MenuItem, IconButton, ListItem, ListItemText, List, ListItemSecondaryAction, Divider } from '@mui/material';
import { projectService } from '../services/projectServices';
import { userService } from '../services/userServices';
import { useSnackbar } from 'notistack';
import AddIcon from '@mui/icons-material/Add';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';

const LinkProjectForm = ({ data }) => {
    const [projects, setProjects] = useState(null);
    const [userAssignedProjects, setUserAssignedProjects] = useState([]);
    const [formValues, setFormValues] = useState({
        _id: data?._id || '',
        project: '',
    });

    const { enqueueSnackbar } = useSnackbar();

    const fetchActiveProjects = async () => {
        try {
            const response = await projectService.getActiveProjects();
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const fetchUserAssignedProjects = async (id) => {
        try {
            const response = await userService.getUserAssignedProjects(id);
            if (response.data.assigned_projects) {
                setUserAssignedProjects(response.data.assigned_projects);
            } else {
                setUserAssignedProjects([]);
            }
        } catch (error) {
            console.error('Error fetching assigned projects:', error);
        }
    };

    useEffect(() => {
        if (data) {
            setFormValues(prev => ({ ...prev, _id: data._id }));
            fetchActiveProjects();
            fetchUserAssignedProjects(data._id);
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));
    };

    const handleLinkProjectForm = async (projectData) => {
        const response = await userService.addProjectToUser(projectData);
        if (response.status === 201) {
            setUserAssignedProjects(response.data.assigned_projects);
            setFormValues(prev => ({ ...prev, project: '' })); // Reset project selection
            enqueueSnackbar("Project Linked Successfully", { variant: 'success' });
        } else {
            enqueueSnackbar(response.response.data.message, { variant: 'error' });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formValues.project) {
            handleLinkProjectForm(formValues);
        }
    };

    const handleDeleteClick = async (projectData) => {
        if (confirm("This User Project Link will be permanently deleted?")) {
            const response = await userService.removeProjectFromUser(projectData);
            if (response) {
                enqueueSnackbar("Project Link Deleted Successfully!!", { variant: 'success' });
                setUserAssignedProjects((prevProjects) => 
                    prevProjects.filter(project => project._id !== projectData.project)
                );
            }
        }
    };

    if (!data) {
        return <Box>No user data available</Box>;
    }

    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { my: 1, width: '100%' },
            }}
            noValidate
            autoComplete="off"
        >
            <TextField 
                name="_id" 
                label="ID" 
                variant="outlined" 
                size="small" 
                fullWidth 
                value={formValues._id} 
                sx={{ display: "none" }} 
            />
            
            <TextField 
                name="name" 
                label="User Name" 
                variant="outlined" 
                size="small" 
                fullWidth 
                value={data.name || ''} 
                disabled 
            />
            
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TextField
                    name="project"
                    select
                    size="small"
                    label="Select Project"
                    sx={{ flex: 1 }}
                    disabled={!projects}
                    value={formValues.project}
                    onChange={handleChange}
                >
                    <MenuItem value="">---Select Project---</MenuItem>
                    {projects && projects.map((project, index) => (
                        <MenuItem value={project._id} key={index}>
                            {project.name}
                        </MenuItem>
                    ))}
                </TextField>
                
                <Button 
                    variant="contained" 
                    onClick={handleSubmit} 
                    disabled={!formValues.project}
                    startIcon={<AddIcon />}
                >
                    Link
                </Button>
            </Box>

            {userAssignedProjects.length > 0 && (
                <Box>
                    <Divider textAlign="left" sx={{ mt: 2, mb: 1 }}>
                        {userAssignedProjects.length} Assigned Project{userAssignedProjects.length > 1 ? 's' : ''}
                    </Divider>
                    <List dense>
                        {userAssignedProjects.map((assignedProject, index) => (
                            <ListItem key={index} sx={{ px: 0 }}>
                                <ListItemText 
                                    primary={assignedProject.name}
                                    // secondary={`Project ID: ${assignedProject._id}`}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton 
                                        edge="end" 
                                        aria-label="remove project" 
                                        size="small" 
                                        onClick={() => handleDeleteClick({ 
                                            _id: data._id, 
                                            project: assignedProject._id 
                                        })}
                                        color="error"
                                    >
                                        <IndeterminateCheckBoxIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </Box>
    );
};

export default LinkProjectForm;