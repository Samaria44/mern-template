// src/components/ActiveLocationsTab.jsx
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { locationService } from '../services/locationServices';

const ActiveLocationsTab = () => {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        fetchActiveLocations();
    }, []);

    const fetchActiveLocations = async () => {
        try {
            const res = await locationService.getActiveLocations();
            setLocations(res);
        } catch (error) {
            console.error("Failed to fetch active locations", error);
        }
    };

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Latitude</TableCell>
                    <TableCell>Longitude</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {locations?.map((loc) => (
                    <TableRow key={loc._id}>
                        <TableCell>{loc.name}</TableCell>
                        <TableCell>{loc.address}</TableCell>
                        <TableCell>{loc.latitude}</TableCell>
                        <TableCell>{loc.longitude}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default ActiveLocationsTab;
