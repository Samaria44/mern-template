

import React from 'react'

export const Toast = ({ message, severity }) => {
    return (
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert
                onClose={handleClose}
                severity={severity == 1 ? "success" : severity == 2 ? "warning" : "error"}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}
