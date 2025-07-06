import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const withAuthRedirect = (WrappedComponent) => (props) => {
  const { authenticated } = useAuth();
  return authenticated ? <Navigate to="/" replace /> : <WrappedComponent {...props} />;
};

export default withAuthRedirect;