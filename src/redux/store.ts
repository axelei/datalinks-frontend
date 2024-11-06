import {configureStore} from '@reduxjs/toolkit'
import loadingReducer from "./loadingSlice.ts";
import userReducer from "./loggedUserSlice.ts";
import showErrorReducer from "./showErrorSlice.ts";
import configReducer from "./configSlice.ts";

export const store = configureStore({
    reducer: {
        loading: loadingReducer,
        loggedUser: userReducer,
        showError: showErrorReducer,
        config: configReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;