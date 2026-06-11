// loadingSlice.js

import { createSlice } from '@reduxjs/toolkit';

const loadingSlice = createSlice({
    name: 'loading',
    initialState: {
        count: 0,
    },
    reducers: {
        startLoading: (state) => {
            state.count += 1;
        },
        stopLoading: (state) => {
            if (state.count > 0) {
                state.count -= 1;
            }
        },
    },
});

export const { startLoading, stopLoading } =
    loadingSlice.actions;

export default loadingSlice.reducer;