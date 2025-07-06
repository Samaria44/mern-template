import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchApi } from '../../services/utils';

// Define initial state
const initialState = {
    entities: [],
    loading: false,
    error: null,
    selectedEntity: null,
};

// Create async thunks
export const fetchEntities = createAsyncThunk(
    'entity/fetchEntities',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchApi('entities', "GET");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const createEntity = createAsyncThunk(
    'entity/createEntity',
    async (entityData, { rejectWithValue }) => {
        try {
            const { _id, ...otherData } = entityData;
            const response = await fetchApi('entities', "POST", otherData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateEntity = createAsyncThunk(
    'entity/updateEntity',
    async ({ id, entityData }, { rejectWithValue }) => {
        try {
            const response = await fetchApi(`entities/${id}`, "PUT", entityData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteEntity = createAsyncThunk(
    'entity/deleteEntity',
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetchApi(`entities/${id}`, "DELETE");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const toggleEntityStatus = createAsyncThunk(
    'entity/toggleEntityStatus',
    async ({ id, active }, { rejectWithValue }) => {
        try {
            const response = await fetchApi(`entities/${id}/status`, "PUT", { active });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Create slice
const entitySlice = createSlice({
    name: 'entity',
    initialState,
    reducers: {
        setSelectedEntity: (state, action) => {
            state.selectedEntity = action.payload;
        },
        resetEntityState: (state) => {
            state.entities = [];
            state.loading = false;
            state.error = null;
            state.selectedEntity = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch entities
        builder
            .addCase(fetchEntities.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEntities.fulfilled, (state, action) => {
                state.loading = false;
                state.entities = action.payload;
            })
            .addCase(fetchEntities.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Create entity
        builder
            .addCase(createEntity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createEntity.fulfilled, (state, action) => {
                state.loading = false;
                state.entities.push(action.payload);
            })
            .addCase(createEntity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Update entity
        builder
            .addCase(updateEntity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEntity.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.entities.findIndex(entity => entity._id === action.payload._id);
                if (index !== -1) {
                    state.entities[index] = action.payload;
                }
            })
            .addCase(updateEntity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Delete entity
        builder
            .addCase(deleteEntity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteEntity.fulfilled, (state, action) => {
                state.loading = false;
                state.entities = state.entities.filter(entity => entity._id !== action.payload._id);
            })
            .addCase(deleteEntity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Toggle entity status
        builder
            .addCase(toggleEntityStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleEntityStatus.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.entities.findIndex(entity => entity._id === action.payload._id);
                if (index !== -1) {
                    state.entities[index] = action.payload;
                }
            })
            .addCase(toggleEntityStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setSelectedEntity, resetEntityState } = entitySlice.actions;
export default entitySlice.reducer;
