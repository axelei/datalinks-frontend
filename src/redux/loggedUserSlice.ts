import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {RootState} from "./store.ts";
import {newUser, User} from "../model/user/User.ts";

interface LoggedUser {
    user: User;
    token: string;
}

const initialState: LoggedUser = {
    user: newUser(),
    token: '',
}

export const loggedUserSlice = createSlice({
    name: 'loggedUser',
    initialState,
    reducers: {
        setLoggedUser: (state, action: PayloadAction<User>) : void => {
            state.user = action.payload;
        },
        setLoggedToken: (state, action: PayloadAction<string>) : void => {
            state.token = action.payload;
        },
    },
});

export const { setLoggedUser, setLoggedToken } = loggedUserSlice.actions;
export default loggedUserSlice.reducer;
export const selectUser = (state: RootState) => state.loggedUser;

