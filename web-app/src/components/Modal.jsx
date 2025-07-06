import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

export default function ScrollModal({ title, innerComponent, data, modalOpen, handleCloseModal }) {
    const descriptionElementRef = React.useRef(null);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    React.useEffect(() => {
        if (modalOpen) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [modalOpen]);
    //data != null ? "Update User Form" : "Add User Form"
    return (
        <React.Fragment>
            <Dialog
                // fullScreen={fullScreen}
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                maxWidth="sm"
                fullWidth={true}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <DialogTitle id="scroll-dialog-title">{`${title}`}</DialogTitle>
                    <CloseIcon onClick={handleCloseModal} display={"block"} sx={{ mr: 2, cursor: 'pointer' }} />
                </Box>
                <DialogContent dividers={true}>
                    {/* <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    > */}
                        {innerComponent}
                    {/* </DialogContentText> */}
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}