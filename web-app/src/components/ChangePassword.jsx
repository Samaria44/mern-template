import { Box, Button, Grid, TextField, Typography } from "@mui/material"
import { authService } from "../services/authServices";
import { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";

const ChangePassword = () => {

    const [formValues, setFormValues] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });

        // Validate confirmPassword
        if (name === 'confirmPassword' || (name === 'newPassword' && formValues.confirmPassword)) {
            if (value !== formValues.newPassword) {
                setConfirmPasswordError("Passwords do not match");
            } else {
                setConfirmPasswordError('');
            }
        }
    };

    useEffect(() => {
        // Check if all fields are filled and passwords match
        const isFormValid =
            formValues.currentPassword &&
            formValues.newPassword &&
            formValues.confirmPassword &&
            formValues.newPassword === formValues.confirmPassword;

        setIsFormValid(isFormValid);
    }, [formValues]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Add form submission logic here
        if (formValues.newPassword !== formValues.confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
        } else {
            setConfirmPasswordError('');
            // Proceed with form submission
            try {
                const response = await authService.updateUserPassword(formValues.currentPassword, formValues.newPassword);
                // console.log(response);
                if (response.status == 200) {
                    // alert("passwrod updated sucessfully!!")
                    enqueueSnackbar("Passwrod Updated Sucessfully!!", { variant: 'success' });
                    setFormValues({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                    });
                }
            } catch (error) {
                // alert(error);
                enqueueSnackbar(error.response.data.message, { variant: 'error' });
                console.log("error updating password ", error);
            }
        }
    };
    return <Box>
        <Typography variant={"h6"} style={{ margin: "15px 0px" }}>Change Passwrord</Typography>
        <Box
            component="form"
            sx={{
                '& > :not(style)': { my: 1, width: '100%' },
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
        >
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                    <TextField name="currentPassword" label="Current Password" variant="outlined" size="small" fullWidth type="password" value={formValues.currentPassword} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField name="newPassword" label="New Password" variant="outlined" size="small" fullWidth type="password" value={formValues.newPassword} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField name="confirmPassword" label="Confirm Password" variant="outlined" size="small" type="password" fullWidth value={formValues.confirmPassword} onChange={handleChange} error={!!confirmPasswordError}
                        helperText={confirmPasswordError} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button type="submit" variant="contained" size="small" disabled={!isFormValid}>{"Change Password"}</Button>
                </Grid>
            </Grid>
        </Box>

    </Box>
}

export default ChangePassword;