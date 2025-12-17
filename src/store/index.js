// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import itemsReducer from './itemsSlice';
import categoriesReducer from './categoriesSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        items: itemsReducer,
        categories: categoriesReducer,
    },
});