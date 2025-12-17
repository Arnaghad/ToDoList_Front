// src/store/itemsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

// --- Existing Thunks ---
export const fetchItems = createAsyncThunk('items/fetchAll', async (filters = {}, { rejectWithValue }) => {
    try {
        const params = new URLSearchParams();
        if (filters.categoryId) params.append('CategoryId', filters.categoryId);
        if (filters.priority) params.append('Priority', filters.priority);
        if (filters.isLooped !== undefined) params.append('IsLooped', filters.isLooped);
        if (filters.isCompleted !== undefined) params.append('IsCompleted', filters.isCompleted);
        if (filters.searchTerm) params.append('SearchTerm', filters.searchTerm);

        const response = await axios.get('/Items', { params });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

export const createItem = createAsyncThunk('items/create', async (itemData, { rejectWithValue }) => {
    try {
        const response = await axios.post('/Items', itemData);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

// --- New Thunks ---

export const updateItem = createAsyncThunk('items/update', async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`/Items/${id}`, data);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

export const deleteItem = createAsyncThunk('items/delete', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`/Items/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

export const completeItem = createAsyncThunk('items/complete', async (id, { rejectWithValue }) => {
    try {
        await axios.post(`/Items/${id}/complete`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

export const toggleLoop = createAsyncThunk('items/toggleLoop', async (id, { rejectWithValue }) => {
    try {
        await axios.post(`/Items/${id}/toggle-loop`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

export const updatePriority = createAsyncThunk('items/updatePriority', async ({ id, priority }, { rejectWithValue }) => {
    try {
        await axios.patch(`/Items/${id}/priority`, { priority });
        return { id, priority };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

// --- Bulk Operations ---

export const bulkDeleteItems = createAsyncThunk('items/bulkDelete', async (ids, { rejectWithValue }) => {
    try {
        await axios.post('/BulkOperations/items/bulk-delete', ids);
        return ids;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

export const bulkCompleteItems = createAsyncThunk('items/bulkComplete', async (ids, { rejectWithValue }) => {
    try {
        await axios.post('/BulkOperations/items/bulk-complete', ids);
        return ids;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message);
    }
});

const itemsSlice = createSlice({
    name: 'items',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        itemAdded: (state, action) => {
            state.items.push(action.payload);
        },
        itemUpdated: (state, action) => {
            const index = state.items.findIndex(i => i.id === action.payload.id);
            if (index !== -1) state.items[index] = action.payload;
        },
        itemDeleted: (state, action) => {
            state.items = state.items.filter(i => i.id !== action.payload);
        },
        itemCompleted: (state, action) => {
            const index = state.items.findIndex(i => i.id === action.payload);
            if (index !== -1) state.items[index].isCompleted = true;
        },
        itemLoopToggled: (state, action) => {
            const index = state.items.findIndex(i => i.id === action.payload);
            if (index !== -1) state.items[index].isLooped = !state.items[index].isLooped;
        },
        itemPriorityUpdated: (state, action) => {
            const index = state.items.findIndex(i => i.id === action.payload.id);
            if (index !== -1) state.items[index].priority = action.payload.priority;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchItems.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Create
            .addCase(createItem.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })

            // Update
            .addCase(updateItem.fulfilled, (state, action) => {
                const index = state.items.findIndex(i => i.id === action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
            })

            // Delete
            .addCase(deleteItem.fulfilled, (state, action) => {
                state.items = state.items.filter(i => i.id !== action.payload);
            })

            // Complete
            .addCase(completeItem.fulfilled, (state, action) => {
                const index = state.items.findIndex(i => i.id === action.payload);
                if (index !== -1) {
                    state.items[index].isCompleted = true;
                    // Optionally update EndedAt if returned, but here we just toggle local flag or rely on re-fetch if needed.
                    // Ideally API returns updated item, but it returns bool.
                    // We can optimistically update.
                }
            })

            // Toggle Loop
            .addCase(toggleLoop.fulfilled, (state, action) => {
                const index = state.items.findIndex(i => i.id === action.payload);
                if (index !== -1) {
                    state.items[index].isLooped = !state.items[index].isLooped;
                }
            })

            // Update Priority
            .addCase(updatePriority.fulfilled, (state, action) => {
                const index = state.items.findIndex(i => i.id === action.payload.id);
                if (index !== -1) {
                    state.items[index].priority = action.payload.priority;
                }
            })

            // Bulk Delete
            .addCase(bulkDeleteItems.fulfilled, (state, action) => {
                const ids = action.payload;
                state.items = state.items.filter(i => !ids.includes(i.id));
            })

            // Bulk Complete
            .addCase(bulkCompleteItems.fulfilled, (state, action) => {
                const ids = action.payload;
                state.items.forEach(item => {
                    if (ids.includes(item.id)) {
                        item.isCompleted = true;
                    }
                });
            });
    },
});

export const {
    itemAdded,
    itemUpdated,
    itemDeleted,
    itemCompleted,
    itemLoopToggled,
    itemPriorityUpdated
} = itemsSlice.actions;

export default itemsSlice.reducer;