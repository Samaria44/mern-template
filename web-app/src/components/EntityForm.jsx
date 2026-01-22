import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, MenuItem, FormControlLabel, Switch } from '@mui/material';

const EntityForm = ({ submitHandler, data }) => {
    const [formValues, setFormValues] = useState({
        _id: '',
        name: '',
        description: '',
        type: '',
        active: true
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

    const validate = () => {
        let errors = {};

        if (!formValues.name) errors.name = 'Name is required';
        if (!formValues.type) errors.type = 'Type is required';

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
            />
            
            <TextField 
                name="description" 
                label="Description" 
                variant="outlined" 
                size="small" 
                fullWidth 
                value={formValues.description}
                onChange={handleChange}
            />
            
            <TextField
                name="type"
                select
                size="small"
                label="Type"
                sx={{ width: "100%" }}
                value={formValues.type}
                onChange={handleChange}
            >
                <MenuItem value="">---Select---</MenuItem>
                <MenuItem value="type1">Type 1</MenuItem>
                <MenuItem value="type2">Type 2</MenuItem>
                <MenuItem value="type3">Type 3</MenuItem>
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

export default EntityForm;
