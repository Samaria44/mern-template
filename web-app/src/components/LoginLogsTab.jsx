import React, { useEffect, useState } from 'react';
import ControledDataGrid from './ControledDataGrid';
import { Box, Button, Grid } from '@mui/material';
import { userService } from '../services/userServices';
import { convertUtcToLocal } from '../utils/helperFunctions';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import ExcelHelper from '../utils/excelhelper';
import { saveAs } from 'file-saver';
import { lightTheme } from '../styles/theme';

const LoginLogsTab = () => {
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState(null);
    const [formValues, setFormValues] = useState({
        from: null,
        to: null
    });

    const columns = [
        {
            field: 'name',
            headerName: 'Name',
            width: 200,
            renderCell: (params) => <>{params.row.user?.name}</>,
            valueGetter: (params) => {
                const user = params;
                return user?.name;
            }
        },
        {
            field: 'username',
            headerName: 'Username',
            width: 200,
            renderCell: (params) => <>{params.row.user?.username}</>,
            valueGetter: (params) => {
                const user = params;
                return user?.username;
            }
        },
        {
            field: 'login_at',
            headerName: 'Login Time',
            width: 250,
            align: "center",
            headerAlign: 'center',
            valueFormatter: (params) => convertUtcToLocal(params),
        },
        {
            field: 'created_at',
            headerName: 'Created at',
            width: 250,
            align: "center",
            headerAlign: 'center',
            valueFormatter: (params) => convertUtcToLocal(params),
        },
    ];

    const fetchUserlogs = async (filterParams) => {
        try {
            setLoading(true);
            const response = await userService.getUsersLoginLogs(filterParams);
            setLogs(response.data);
        } catch (error) {
            console.error('Error fetching user logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const searchHandler = () => {
        fetchUserlogs(formValues);
    };

    const handleDateChange = (name, newValue) => {
        if (!newValue) return;
        const isoString = new Date(newValue).toISOString();
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: isoString,
        }));
    };

    const handleClearFilter = () => {
        setFormValues({
            from: null,
            to: null
        });
        fetchUserlogs({});
    };

    const exportToExcel = async () => {
        if (!logs) return;

        const headers = [
            { name: 'Name', key: 'name', format: 'text' },
            { name: 'Username', key: 'username', format: 'text' },
            { name: 'Login Time', key: 'login_at' },
            { name: 'Created at', key: 'created_at' }
        ];

        // Transform the data to flatten the user object
        const transformedData = logs.map(log => ({
            name: log.user?.name || '',
            username: log.user?.username || '',
            login_at: convertUtcToLocal(log.login_at),
            created_at: convertUtcToLocal(log.created_at)
        }));

        try {
            const blob = await ExcelHelper.generateExcel({
                fileName: 'login_logs',
                sheetName: 'Login Logs',
                headers,
                data: transformedData,
                styles: {
                    header: {
                        font: { 
                            bold: true,
                            color: { argb: 'FFFFFFFF' }
                        },
                        fill: { 
                            type: 'pattern', 
                            pattern: 'solid', 
                            fgColor: { argb: lightTheme.primary.main }
                        },
                        alignment: { horizontal: 'center' }
                    },
                    row: {
                        alignment: { horizontal: 'center' }
                    }
                }
            });
            saveAs(blob, 'login_logs.xlsx');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
        }
    };

    useEffect(() => {
        fetchUserlogs();
    }, []);

    return (
        <Box>
            {/* Date Range Filters */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                    <Grid item xs={12} sm={3}>
                        <DateTimePicker
                            label="From Date Time"
                            value={formValues.from ? dayjs(formValues.from) : null}
                            onChange={(newValue) => handleDateChange("from", newValue)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    size: 'small',
                                    variant: 'outlined',
                                    InputProps: {
                                        sx: { height: 40 },
                                    },
                                    InputLabelProps: {
                                        shrink: true,
                                        sx: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            height: '100%',
                                            fontSize: 14,
                                        },
                                    },
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <DateTimePicker
                            label="To Date Time"
                            value={formValues.to ? dayjs(formValues.to) : null}
                            onChange={(newValue) => handleDateChange("to", newValue)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    size: 'small',
                                    variant: 'outlined',
                                    InputProps: {
                                        sx: { height: 40 },
                                    },
                                    InputLabelProps: {
                                        shrink: true,
                                        sx: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            height: '100%',
                                            fontSize: 14,
                                        },
                                    },
                                },
                            }}
                        />
                    </Grid>
                    </Box>                            
                    <Box>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                                onClick={exportToExcel}
                                type="button"
                                variant="contained"
                                color="primary"
                                size="medium"
                                sx={{ height: 40, minWidth: 150 }}
                            >
                                Export
                            </Button>
                            <Button
                                onClick={handleClearFilter}
                                type="button"
                                variant="outlined"
                                size="medium"
                                sx={{ height: 40, minWidth: 150 }}
                            >
                                Clear Filter
                            </Button>
                            <Button
                                onClick={searchHandler}
                                type="button"
                                variant="contained"
                                size="medium"
                                sx={{ height: 40, minWidth: 150 }}
                            >
                                Apply Filter
                            </Button>
                        </Box>
                    </Grid>
                    </Box>
            </Box>

            {/* Login Logs Data Grid */}
            <ControledDataGrid
                entity={'user'}
                tableData={logs}
                columns={columns}
                action={false}
                link={false}
                loading={loading}
            />
        </Box>
    );
};

export default LoginLogsTab;