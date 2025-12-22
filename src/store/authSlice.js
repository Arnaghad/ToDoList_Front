// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

export const registerUser = createAsyncThunk('auth/register', async ({ userName, email, password }, { rejectWithValue }) => {
    try {
        const response = await axios.post('/Auth/register', { userName, email, password });
        // Assuming registration also returns a token like login, or we treat it as success and require login.
        // If it returns a token, we save it.
        if (response.data.data) {
            localStorage.setItem('token', response.data.data);
            return response.data.data;
        }
        return null; // Or handle "Check email" scenario
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
});

export const loginUser = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
    try {
        const response = await axios.post('/Auth/login', { email, password });
        // Зберігаємо токен
        localStorage.setItem('token', response.data.data);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('token') || null,
        isAuthenticated: !!localStorage.getItem('token'),
        status: 'idle',
        error: null,
    },
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            state.token = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => { state.status = 'loading'; })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.token = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            .addCase(registerUser.pending, (state) => { state.status = 'loading'; })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                if (action.payload) {
                    state.token = action.payload;
                    state.isAuthenticated = true;
                }
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;