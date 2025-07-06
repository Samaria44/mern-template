import * as React from 'react';
import { CssBaseline, TextField, Link, Grid, Box, Typography, Container, Button } from '@mui/material';
import { Copyright } from '../../components/Copyright';
import { authService } from '../../services/authServices';
import { Toast } from '../../components/Toast';
import { useNavigate } from 'react-router-dom';

export const Register = () => {


    const handleSubmit = (event) => {
        const navigate = useNavigate()
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let email = data.get('email');
        let password = data.get('password');
        let name = data.get('firstName') + data.get('lastName');
        let phone = data.get('phone');
        // console.log({
        //     name: name,
        //     phone: phone,
        //     email: email,
        //     password: password,
        // });
        authService.registerUser(name, phone, email, password)
            .then(response => {
                // console.log(response);
                if (response.status == 200) {
                    // console.log(response.message + " : " + response.data.email);
                    // return <Toast message={response.message + " : " + response.data.email} severity={1}/>
                    // setMessage(response.message + " : " + response.data.email);
                    navigate("/login");
                }
            })
            .catch(error => {
                console.error(error);
                // return <Toast message={error} severity={3}/>
                // setMessage(response.message);
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
                    margin: "auto",
                }}
            >
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="family-name"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="phone"
                                label="Phone"
                                name="phone"
                                autoComplete="phone"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-start">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                    <Copyright sx={{ mt: 5 }} />
                </Box>
            </Box>
        </Grid>
    );
}