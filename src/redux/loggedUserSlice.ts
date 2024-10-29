import {createSlice} from '@reduxjs/toolkit'
import {RootState} from "./store.ts";
import {User} from "../model/user/User.ts";
import {UserLevel} from "../model/user/UserLevel.ts";

const initialState: User = {
    email: "",
    name: "",
    userLevel: UserLevel.user,
    username: "Anonymous IP",
}

export const loggedUserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setLoggedUser: (state, action) : void => {
            state.userLevel = action.payload;
        },
    },
});

export const { setLoggedUser } = loggedUserSlice.actions;
export default loggedUserSlice.reducer;
export const selectUser = (state: RootState) => state.loggedUser;

