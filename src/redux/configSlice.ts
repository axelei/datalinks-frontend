import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {RootState} from "./store.ts";
import {AssociativeArray} from "../service/Common.ts";

export interface ConfigState {
    value : AssociativeArray<string>,
}

const initialState: ConfigState = {
    value: {},
};

export const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        setConfig: (state, action: PayloadAction<AssociativeArray<string>>) : void => {
            state.value = action.payload;
        },
    },
});

export const { setConfig } = configSlice.actions;
export default configSlice.reducer;
export const selectConfig = (state: RootState) => state.config;

