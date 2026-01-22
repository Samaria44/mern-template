import React, { useEffect, useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const StoreForm = ({ data = null, submitHandler }) => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        weight: '',
        carats: '',
        code:'',
        price: '',
    });

    useEffect(() => {
        if (data) {
            setFormData({
                _id: data._id || '',
                name: data.name || '',
                weight: data.weight || '',
                carats: data.carats || '',
                code:data.code||'',
                price: data.price || '',
            });
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { _id, ...rest } = formData;

        const payload = {
            ...rest,
            weight: rest.weight === '' ? null : Number(rest.weight),
            carats: rest.carats === '' ? null : Number(rest.carats),
            price: rest.price === '' ? null : Number(rest.price),
        };

        if (_id) {
            submitHandler({ _id, ...payload });
        } else {
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
                label="Weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                type="number"
                fullWidth
                required
                sx={{ mb: 2 }}
            />
            <TextField
                label="Carats"
                name="carats"
                value={formData.carats}
                onChange={handleChange}
                type="number"
                fullWidth
                required
                sx={{ mb: 2 }}
            />
            <TextField
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                type="number"
                fullWidth
                required
                sx={{ mb: 2 }}
            />

            <TextField
                label="Code (for QR / barcode)"
                name="code"
                value={formData.code}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="contained" color="primary">
                    {formData._id ? 'Update' : 'Add'}
                </Button>
            </Box>
        </form>
    );
};

export default StoreForm;

