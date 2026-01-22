import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, MenuItem, FormControlLabel, Switch } from '@mui/material';
import { departmentService } from '../services/departmentServices';
import { locationService } from '../services/locationServices';

const UserForm = ({ submitHandler, data }) => {
    const [formValues, setFormValues] = useState({
        _id: '',
        name: '',
        email: '',
        username: '',
        number: '',
        role: '',
        cnic: '',
        department: '',
        location: '',
        active: true
    });

    const [departments, setDepartments] = useState(null);
    const [locations, setLocations] = useState(null);

    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (data) {
            setFormValues(data);
        }
    }, [data]);

    const fetchDepartments = async () => {
        try {
            const response = await departmentService.getActiveDepartments();
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching Active Departments:', error);
        }
    };

    const fetchLocations = async () => {
        try {
            const response = await locationService.getLocations();
            const allLocations = response || [];
            const activeLocations = allLocations.filter(loc => loc.active);
            setLocations(activeLocations);
        } catch (error) {
            console.error('Error fetching Locations:', error);
        }
    };

    useEffect(() => {
        fetchDepartments();
        fetchLocations();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));
    };

    const validate = () => {
        let errors = {};

        if (!formValues.name) errors.name = 'Name is required';
        if (!formValues.email) errors.email = 'Email is required';
        if (!formValues.username) errors.username = 'Username is required';
        if (!formValues.number) errors.number = 'Contact number is required';
        if (!formValues.department) errors.department = 'Department is required';
        if (!formValues.location) errors.location = 'Location is required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            submitHandler(formValues);
        }
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
            <TextField 
                name="_id" 
                label="ID" 
                variant="outlined" 
                size="small" 
                fullWidth 
                value={formValues._id} 
                onChange={handleChange} 
                sx={{ display: "none" }} 
            />
            
            <TextField 
                name="name" 
                label="Name" 
                variant="outlined" 
                size="small" 
                fullWidth 
                value={formValues.name}
                onChange={handleChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
            />
            
            <TextField 
                name="email" 
                label="Email" 
                variant="outlined" 
                size="small" 
                fullWidth 
                value={formValues.email}
                error={!!formErrors.email}
                helperText={formErrors.email}
                onChange={handleChange} 
            />
            
            <TextField 
                name="username" 
                label="Username" 
                variant="outlined" 
                size="small" 
                fullWidth 
                value={formValues.username}
                onChange={handleChange}
                error={!!formErrors.username}
                helperText={formErrors.username}
            />
            
            <TextField 
                name="number" 
                label="Contact No" 
                variant="outlined" 
                size="small" 
                fullWidth 
                value={formValues.number}
                onChange={handleChange}
                error={!!formErrors.number}
                helperText={formErrors.number}
            />
            
            <TextField 
                name="cnic" 
                label="CNIC" 
                variant="outlined" 
                size="small" 
                fullWidth 
                value={formValues.cnic}
                onChange={handleChange}
                error={!!formErrors.cnic}
                helperText={formErrors.cnic}
            />
            
            <TextField
                name="department"
                select
                size="small"
                label="Department"
                sx={{ width: "100%" }}
                value={formValues.department}
                onChange={handleChange}
                error={!!formErrors.department}
                helperText={formErrors.department}
            >
                <MenuItem value="">---select---</MenuItem>
                {departments && departments.map((department, index) => (
                    <MenuItem value={department._id} key={index}>
                        {department.name}
                    </MenuItem>
                ))}
            </TextField>
            
            <TextField
                name="location"
                select
                size="small"
                label="Location"
                sx={{ width: "100%" }}
                value={formValues.location}
                onChange={handleChange}
                error={!!formErrors.location}
                helperText={formErrors.location}
            >
                <MenuItem value="">---select---</MenuItem>
                {locations && locations.map((location, index) => (
                    <MenuItem value={location._id} key={index}>
                        {location.name}
                    </MenuItem>
                ))}
            </TextField>
            
            <TextField
                name="role"
                select
                size="small"
                label="Role"
                sx={{ width: "100%", display: !data && "none" }}
                value={formValues.role}
                onChange={handleChange}
            >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            
            <FormControlLabel
                control={
                    <Switch
                        checked={formValues.active}
                        onChange={(e) => setFormValues({ ...formValues, active: e.target.checked })}
                        name="active"
                        color="primary"
                    />
                }
                label="Active"
                sx={{ mt: 2 }}
            />
            
            <Button 
                type="submit" 
                variant="contained" 
                size="medium" 
                sx={{ mt: 2 }}
            >
                {data ? "Update" : "Add"}
            </Button>
        </Box>
    );
};

export default UserForm;