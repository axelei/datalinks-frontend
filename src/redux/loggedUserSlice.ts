import {createSlice} from '@reduxjs/toolkit'
import {RootState} from "./store.ts";
import {User} from "../model/user/User.ts";
import {UserLevel} from "../model/user/UserLevel.ts";

const initialState: User = {
    email: "",
    name: "",
    userLevel: UserLevel.guest,
    username: "Anonymous IP",
}

export const loggedUserSlice = createSlice({
    name: 'loggedUser',
    initialState,
    reducers: {
        setLoggedUser: (_state, action) : void => {
            return action.payload;
        },
    },
});

export const { setLoggedUser } = loggedUserSlice.actions;
export default loggedUserSlice.reducer;
export const selectUser = (state: RootState) => state.loggedUser;

