import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

export default function ScrollDialog({ title, form, submitHandler, data, modalOpen, handleCloseModal, handleOpenModal }) {
    const [open, setOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');

    const handleClickOpen = () => {
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false);
    };

    const descriptionElementRef = React.useRef(null);
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
            <Button sx={{ mb: 2 }} onClick={handleOpenModal} variant="contained" startIcon={<AddIcon />}>Add {title}</Button>
            <Dialog
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                maxWidth="sm"
                fullWidth={true}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems:"center" }}>
                    <DialogTitle id="scroll-dialog-title">{data != null ? `Update ${title}` : `Add ${title}`}</DialogTitle>
                    <CloseIcon onClick={handleCloseModal} display={"block"} sx={{mr:2}} cursor="pointer"/>
                </Box>
                <DialogContent dividers={scroll === 'paper'}>
                    {/* <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    > */}
                        {form}
                    {/* </DialogContentText> */}
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}