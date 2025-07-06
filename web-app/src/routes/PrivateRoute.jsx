import React from 'react';
import { Route, Outlet, Navigate } from 'react-router-dom';
import { setIsRegisteredUser } from '../features/Slicers/authSlice';
import { useAppSelector } from '../hooks/hooks';
import { useAuth } from '../contexts/authContext';

const PrivateRoute = () => {
    // const userAuth = localStorage.getItem("token");
    const { authenticated } = useAuth();
    // console.log("authenticated: " + authenticated);
    return authenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;

