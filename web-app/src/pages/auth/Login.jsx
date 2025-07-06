
import * as React from 'react';
import { Button, CssBaseline, TextField, Link, Box, Grid, Typography, CircularProgress } from '@mui/material';
import { authService } from '../../services/authServices';
import { Copyright } from '../../components/Copyright';
import { useAuth } from '../../contexts/authContext';
import { useDispatch } from 'react-redux';
import { setIsRegisteredUser } from '../../features/Slicers/authSlice';
import { useAppDispatch } from '../../hooks/hooks';
import Logo from "../../assets/logo.png";
import { useSnackbar } from 'notistack';

export const Login = () => {
    const dispatch = useAppDispatch();
    localStorage.clear();
    const { enqueueSnackbar } = useSnackbar();
    const { login } = useAuth();
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = (event) => {
        setLoading(true)
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let email = data.get('email');
        let password = data.get('password');
        // console.log({
        //     email: email,
        //     password: password,
        // });
        authService.loginUser(email, password)
            .then(response => {
                // console.log(response);
                setLoading(false);
                if (response.data.accessToken) {
                    login(response.data.accessToken, response.data.refreshToken, response.data.id, response.data.name, response.data.roles, response.data.permissions);
                    // setMessage(response.message);
                    // console.log(response)
                    dispatch(setIsRegisteredUser(true));
                    // dispatch(setUserName(response.data.name));
                    // navigate("/");
                    // return <Toast message={"login Successfull"} severity={1}/>
                    enqueueSnackbar("Login Sucessfull", { variant: 'success' });
                }
                // alert(response)
            })
            .catch(error => {
                // alert("Login not successful")
                setLoading(false);
                enqueueSnackbar("Login Failed!!", { variant: 'error' });
                console.error(error);
                // return <Toast message={error} severity={3}/>
                // setMessage(error.message);
            });
    };

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Box
                sx={{
                    my: 8,
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    margin: "auto"
                }}
            >
                <Box style={{ width: "100%", display: "flex", justifyContent: "center", margin: "10px" }} >
                    <img src={Logo} alt="logo" style={{ width: "150px", ...(!open && { display: 'none' }) }} />
                </Box>
                <Typography component="h1" variant="h5" sx={{ m: 1 }}>
                    CMS | SIGN IN
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} mx={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        startIcon={<CircularProgress color="inherit" size="30px" sx={{ ...(!loading && { display: 'none' }) }} />}
                        variant="contained"
                        disabled={loading}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Copyright sx={{ mt: 5 }} />
                </Box>
            </Box>
        </Grid>
    );
}
