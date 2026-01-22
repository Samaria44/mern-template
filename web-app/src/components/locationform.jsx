import React, { useEffect, useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const LocationForm = ({ data = null, submitHandler }) => {
    const [formData, setFormData] = useState({
        id:'',
        name: '',
        address: '',
        latitude: '',
        longitude: '',
    });

    useEffect(() => {
        if (data) {
            setFormData({
                _id: data._id || '',
                name: data.name || '',
                address: data.address || '',
                latitude: data.latitude || '',
                longitude: data.longitude || '',
            });
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { _id, ...rest } = formData;

        const payload = {
            ...rest,
            latitude: rest.latitude === '' ? null : Number(rest.latitude),
            longitude: rest.longitude === '' ? null : Number(rest.longitude),
        };

        // If editing, include _id so parent can route update correctly
        if (_id) {
            submitHandler({ _id, ...payload });
        } else {
            // Creating: do not send _id at all, let Mongo generate it
            submitHandler(payload);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
            />
            <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
            />
            <TextField
                label="Latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                type="number"
                fullWidth
                required
                sx={{ mb: 2 }}
            />
            <TextField
                label="Longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                type="number"
                fullWidth
                required
                sx={{ mb: 2 }}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button type="submit" variant="contained" color="primary">
                    {formData._id ? "Update" : "Add"}
                </Button>
            </Box>
        </form>
    );
};

export default LocationForm;
