// import { BorderAllRounded } from "@mui/icons-material";
// import { Backdrop, Box, Button, Fade, Modal, Typography } from "@mui/material";

// import gif from "../assets/tick.gif";
// import { useTheme } from "@emotion/react";
// import { useNavigate } from "react-router-dom";

// const style = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 400,
//     bgcolor: 'background.paper',
//     // border: '2px solid #000',
//     boxShadow: 24,
//     p: 4,
//     textAlign: "center",
//     borderRadius: 5

// };

// const Popup = ({ openPopup, handlePopupClose }) => {
//     const theme = useTheme();
//     const navigate = useNavigate();

//     const handleClick = () => {
//         navigate('/complains');
//     };
//     return <Modal
//         aria-labelledby="transition-modal-title"
//         aria-describedby="transition-modal-description"
//         open={openPopup}
//         onClose={handlePopupClose}
//         closeAfterTransition
//         slots={{ backdrop: Backdrop }}
//         slotProps={{
//             backdrop: {
//                 timeout: 500,
//             },
//         }}
//     >
//         <Fade in={openPopup}>
//             <Box sx={{...style, border:"3px solid", borderColor:theme.palette.primary.main}}>
//                 <img src={gif} alt="My GIF"/>
//                 <Typography id="transition-modal-title" variant="h6" component="h2">
//                     Review Your Complaines
//                 </Typography>
//                 <Typography id="transition-modal-description" sx={{ mt: 2 }}>
//                     Your generated complain have updates, please review it!!
//                 </Typography>
//                 <Box sx={{ mt:3 }}>
//                 <Button sx={{ mx:1 }} onClick={handlePopupClose} variant="outlined" size="small">Cancel</Button>
//                 <Button sx={{ mx:1 }} onClick={handleClick} variant="contained" size="small">View</Button>
//                 </Box>
//             </Box>
//         </Fade>
//     </Modal>
// }

// export default Popup;


import { useTheme } from "@emotion/react";
import { Backdrop, Box, Fade, Modal } from "@mui/material";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    textAlign: "center",
    borderRadius: 5

};

const Popup = ({ innerComponent, openPopup, handlePopupClose }) => {
    const theme = useTheme();
    return <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openPopup}
        onClose={handlePopupClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
            backdrop: {
                timeout: 500,
            },
        }}
    >
        <Fade in={openPopup}>
            <Box sx={{ ...style, border: "3px solid", borderColor: theme.palette.primary.main }}>
                {innerComponent}
            </Box>
        </Fade>
    </Modal>
}

export default Popup;