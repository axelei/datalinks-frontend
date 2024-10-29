import {createSlice} from '@reduxjs/toolkit'
import {RootState} from "./store.ts";

interface LoadingState {
    value: boolean
}

const initialState: LoadingState = {
    value: false,
}

export const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        loadingOn: (state) => {
            state.value = true
        },
        loadingOff: (state) => {
            state.value = false
        },
    },
});

export const { loadingOn, loadingOff } = loadingSlice.actions;
export default loadingSlice.reducer;
export const selectLoading = (state: RootState) => state.loading.value;

