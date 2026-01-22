import React, { useEffect, useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const StoreForm = ({ data = null, submitHandler }) => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        buyPrice: '',
        sellPrice: '',
        stock: '',
        code:'',
    });

    useEffect(() => {
        if (data) {
            setFormData({
                _id: data._id || '',
                name: data.name || '',
                buyPrice: data.buyPrice || '',
                sellPrice: data.sellPrice || '',
                stock: data.stock || '',
                code:data.code||'',
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
            buyPrice: rest.buyPrice === '' ? null : Number(rest.buyPrice),
            sellPrice: rest.sellPrice === '' ? null : Number(rest.sellPrice),
            stock: rest.stock === '' ? null : Number(rest.stock),
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
                label="Medicine Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
            />
            <TextField
                label="Buy Price"
                name="buyPrice"
                value={formData.buyPrice}
                onChange={handleChange}
                type="number"
                fullWidth
                required
                sx={{ mb: 2 }}
            />
            <TextField
                label="Sell Price"
                name="sellPrice"
                value={formData.sellPrice}
                onChange={handleChange}
                type="number"
                fullWidth
                required
                sx={{ mb: 2 }}
            />
            <TextField
                label="Stock Quantity"
                name="stock"
                value={formData.stock}
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

