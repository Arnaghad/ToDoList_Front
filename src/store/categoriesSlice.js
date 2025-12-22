import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

export const fetchCategories = createAsyncThunk('categories/getAll', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/Categories');
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
});

export const createCategory = createAsyncThunk('categories/create', async (categoryData, { rejectWithValue }) => {
    try {
        const response = await axios.post('/Categories', categoryData);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create category');
    }
});

export const updateCategory = createAsyncThunk('categories/update', async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`/Categories/${id}`, data);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update category');
    }
});

export const deleteCategory = createAsyncThunk('categories/delete', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`/Categories/${id}`);
        return id;
    } catch (error) {
        // Pass the full error response for better handling in UI
        return rejectWithValue({
            message: error.response?.data?.message || 'Failed to delete category',
            status: error.response?.status
        });
    }
});

export const deleteCategoryWithItems = createAsyncThunk('categories/deleteWithItems', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`/Categories/${id}/with-items`);
        return id;
    } catch (error) {
        return rejectWithValue({
            message: error.response?.data?.message || 'Failed to delete category with items',
            status: error.response?.status
        });
    }
});

const categoriesSlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        categoryAdded: (state, action) => {
            const exists = state.categories.some(c => c.id === action.payload.id);
            if (!exists) {
                state.categories.push(action.payload);
            }
        },
        categoryUpdated: (state, action) => {
            const index = state.categories.findIndex(c => c.id === action.payload.id);
            if (index !== -1) state.categories[index] = action.payload;
        },
        categoryDeleted: (state, action) => {
            state.categories = state.categories.filter(c => c.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchCategories.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Create
            .addCase(createCategory.fulfilled, (state, action) => {
                const exists = state.categories.some(c => c.id === action.payload.id);
                if (!exists) {
                    state.categories.push(action.payload);
                }
            })
            // Update
            .addCase(updateCategory.fulfilled, (state, action) => {
                const index = state.categories.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter(c => c.id !== action.payload);
            })
            .addCase(deleteCategoryWithItems.fulfilled, (state, action) => {
                state.categories = state.categories.filter(c => c.id !== action.payload);
            });
    },
});

export const {
    categoryAdded,
    categoryUpdated,
    categoryDeleted
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
