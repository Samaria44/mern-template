import { useEffect, useState } from "react";
import MiniDrawer from "../components/MiniDrawer";
import { useAuth } from "../contexts/authContext";
import { userService } from "../services/userServices";
import { Box, Button, Divider, Grid, TextField, Typography } from "@mui/material";
import { authService } from "../services/authServices";
import { useSnackbar } from "notistack";

const Profile = () => {
    const { user } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    const [userData, setUserData] = useState(null);
    const fetchUser = async () => {
        try {
            const response = await userService.getUser(user);
            setUserData(response.data);
            // console.log("User: ", response.data)
        } catch (error) {
            console.error('Error fetching User:', error);
            // enqueueSnackbar(response.data.message, { variant: 'error' });
        }
    };
    useEffect(() => {
        fetchUser();
    }, []);

    const userFields = [
        { label: 'Username', value: 'username', bgColor: '#ffebee' },
        { label: 'Name', value: 'name', bgColor: '#f5f5f5' },
        { label: 'CNIC', value: 'cnic', bgColor: '#ffebee' },
        { label: 'Email', value: 'email', bgColor: '#f5f5f5' },
        { label: 'Number', value: 'number', bgColor: '#ffebee' },
        { label: 'Department', value: 'department_name', bgColor: '#f5f5f5' },
        { label: 'Role', value: 'role', bgColor: '#ffebee' },
        // {
        //     field: 'created_at', headerName: 'Created at', width: 200, align: "center", headerAlign: 'center',
        //     valueFormatter: (params) => {
        //         return convertUtcToLocal(params);
        //     }
        // },
    ];

    // const [formValues, setFormValues] = useState({
    //     currentPassword: '',
    //     newPassword: ''
    // });

    // const [confirmPasswordError, setConfirmPasswordError] = useState('');
    // const [isFormValid, setIsFormValid] = useState(false);

    // const handleChange = (event) => {
    //     const { name, value } = event.target;
    //     setFormValues({ ...formValues, [name]: value });

    //     // Validate confirmPassword
    //     if (name === 'confirmPassword' || (name === 'newPassword' && formValues.confirmPassword)) {
    //         if (value !== formValues.newPassword) {
    //             setConfirmPasswordError("Passwords do not match");
    //         } else {
    //             setConfirmPasswordError('');
    //         }
    //     }
    // };

    // useEffect(() => {
    //     // Check if all fields are filled and passwords match
    //     const isFormValid =
    //         formValues.currentPassword &&
    //         formValues.newPassword &&
    //         formValues.confirmPassword &&
    //         formValues.newPassword === formValues.confirmPassword;

    //     setIsFormValid(isFormValid);
    // }, [formValues]);

    // const handleSubmit = async (event) => {
    //     event.preventDefault();
    //     // Add form submission logic here
    //     if (formValues.newPassword !== formValues.confirmPassword) {
    //         setConfirmPasswordError("Passwords do not match");
    //     } else {
    //         setConfirmPasswordError('');
    //         // Proceed with form submission
    //         try {
    //             const response = await authService.updateUserPassword(formValues.currentPassword, formValues.newPassword);
    //             console.log(response);
    //             if (response.status == 200) {
    //                 // alert("passwrod updated sucessfully!!")
    //                 enqueueSnackbar("Passwrod Updated Sucessfully!!", { variant: 'success' });
    //             }
    //         } catch (error) {
    //             // alert(error);
    //             enqueueSnackbar(error.response.data.message, { variant: 'error' });
    //             console.log("error updating password ", error);
    //         } 
    //     }
    // };

    // const getBackgroundColor = (field) => {
    //     // Example condition: Change color based on specific field value
    //     if (field.value === 'email' && userData?.email.includes('@example.com')) {
    //         return '#dff0d8'; // Light green for example email domain
    //     }

    //     // Default color based on whether the field's value is present
    //     return userData?.[field.value] ? '#e7f2ff' : '#f5f5f5';
    // };
    return <>
        {/* <MiniDrawer> */}
            <h1>Profile</h1>
            <Grid container spacing={2}>
                {userFields.map((field, index) => (
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={index}>
                        <Box sx={{ background: field.bgColor, p: 2, borderRadius: 1 }}>
                            <Typography variant="caption" display="block" sx={{ fontWeight: 800 }}>
                                {field.label}
                            </Typography>
                            <Typography variant="subtitle1">
                                {userData?.[field.value] || 'N/A'}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
            {/* <Divider textAlign="left">LEFT</Divider> */}
            
        {/* </MiniDrawer> */}
    </>
}

export default Profile;