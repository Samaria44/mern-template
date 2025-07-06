import React from 'react'
import { Box, Typography, Container, Button } from '@mui/material';
import { ErrorOutlineOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
  const navigate = useNavigate()
  return (
    <Container>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        textAlign="center"
      >
        <ErrorOutlineOutlined style={{ fontSize: 96, color: 'gray' }} />
        <Typography variant="h4" style={{ marginTop: '2rem' }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" style={{ marginTop: '1rem' }}>
          The page you are looking for does not exist.
        </Typography>
        <Button onClick={()=>navigate("/")}> Go to Home</Button>
      </Box>
    </Container>
  );
}
