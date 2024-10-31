import {createSlice} from '@reduxjs/toolkit'
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
        setLoggedUser: (_state, action) : void => {
            return action.payload.user;
        },
    },
});

export const { setLoggedUser } = loggedUserSlice.actions;
export default loggedUserSlice.reducer;
export const selectUser = (state: RootState) => state.loggedUser;

