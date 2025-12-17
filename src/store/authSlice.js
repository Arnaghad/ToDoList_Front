// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

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
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;