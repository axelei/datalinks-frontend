import {configureStore} from '@reduxjs/toolkit'
import loadingReducer from "./loadingSlice.ts";
import userReducer from "./loggedUserSlice.ts";

export const store = configureStore({
    reducer: {
        loading: loadingReducer,
        loggedUser: userReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

