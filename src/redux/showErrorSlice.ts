import {createSlice} from '@reduxjs/toolkit'
import {RootState} from "./store.ts";

interface ShowErrorState {
    value: boolean
    message: string
}

const initialState: ShowErrorState = {
    value: false,
    message: "",
}

export const showErrorSlice = createSlice({
    name: 'showError',
    initialState,
    reducers: {
        showError: (state, action) => {
            state.value = true
            state.message = action.payload
        },
        hideError: (state) => {
            state.value = false
            state.message = ""
        },
    },
});

export const { showError, hideError } = showErrorSlice.actions;
export default showErrorSlice.reducer;
export const selectLoading = (state: RootState) => state.showError.value;

