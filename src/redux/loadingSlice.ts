import {createSlice} from '@reduxjs/toolkit'
import {RootState} from "./store.ts";

interface LoadingState {
    count: number
}

const initialState: LoadingState = {
    count: 0,
}

export const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        loadingOn: (state) => {
            state.count += 1
        },
        loadingOff: (state) => {
            state.count = Math.max(0, state.count - 1)
        },
    },
});

export const { loadingOn, loadingOff } = loadingSlice.actions;
export default loadingSlice.reducer;
export const selectLoading = (state: RootState) => state.loading.count > 0;

