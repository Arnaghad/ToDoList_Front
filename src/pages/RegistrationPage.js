import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/authSlice';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';

const RegistrationPage = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationError, setValidationError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError('');

        if (password !== confirmPassword) {
            setValidationError('Passwords do not match');
            return;
        }

        const result = await dispatch(registerUser({ userName, email, password }));
        if (registerUser.fulfilled.match(result)) {
            // Assuming successful registration might log the user in or we redirect to login
            // For now, let's redirect to login if no token is returned, or home if token is set
            // The authSlice update will determine if we have a token.
            navigate('/');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Реєстрація</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal" required fullWidth label="Username"
                        value={userName} onChange={(e) => setUserName(e.target.value)}
                    />
                    <TextField
                        margin="normal" required fullWidth label="Email" type="email"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal" required fullWidth label="Password" type="password"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        margin="normal" required fullWidth label="Confirm Password" type="password"
                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    {validationError && <Typography color="error">{validationError}</Typography>}
                    {error && <Typography color="error">{typeof error === 'string' ? error : 'Registration failed'}</Typography>}

                    <Button
                        type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}
                        disabled={status === 'loading'}
                    >
                        Зареєструватися
                    </Button>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Link component={RouterLink} to="/login" variant="body2">
                            Вже маєте акаунт? Увійти
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default RegistrationPage;
