import { Box, Typography, useTheme } from '@mui/material'
import React from 'react'
// import { Link } from 'react-router-dom'
import { Link } from '@mui/material';

export const Footer = () => {
    const theme = useTheme();
    return (
        <Box sx={{
            background: theme.palette.background.default,
            width: "100%",
            height: 50,
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            borderTop: 1,
            borderColor: "#0000001f",
            display: "flex",         
            alignItems: "center",    
            zIndex: theme.zIndex.appBar,
            marginLeft:8,
            paddingX: 3,             
            paddingY: 1              
        }}>
            <Typography variant='body2' sx={{
                textAlign: "center",
                color: theme.palette.text.primary
            }}>
                Design & Develop By{' '}
                <Link
                    href='https://www.grapners.com'
                    target='_blank'
                    rel="noopener noreferrer"
                    style={{ fontWeight: "700", textDecoration: "none" }}
                >
                    Grapners
                </Link>
            </Typography>
        </Box>
    )
}
