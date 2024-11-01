import {createSlice} from '@reduxjs/toolkit'
import {RootState} from "./store.ts";

interface ShowErrorState {
    value: boolean
}

const initialState: ShowErrorState = {
    value: false,
}

export const showErrorSlice = createSlice({
    name: 'showError',
    initialState,
    reducers: {
        showError: (state) => {
            state.value = true
        },
        hideError: (state) => {
            state.value = false
        },
    },
});

export const { showError, hideError } = showErrorSlice.actions;
export default showErrorSlice.reducer;
export const selectLoading = (state: RootState) => state.showError.value;

