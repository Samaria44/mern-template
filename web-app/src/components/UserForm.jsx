import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, MenuItem } from '@mui/material';
import { departmentService } from '../services/departmentServices';

const UserForm = ({ submitHandler, data }) => {
    const [formValues, setFormValues] = useState({
        _id: '',
        name: '',
        email: '',
        username: '',
        number: '',
        role: '',
        cnic: '',
        department: ''
    });

    const [departments, setDepartments] = useState(null);
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

    useEffect(() => {
        fetchDepartments();
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