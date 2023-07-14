import { configureStore } from "@reduxjs/toolkit";
import loggedReducer from "../reducers/isLogged";
import taskReducer from "../reducers/tasks";
import profileReducer from "../reducers/profile";
import connectionsReducer from "../reducers/connections";

const store = configureStore({
    // Automatically calls `combineReducers`
    reducer: {
        loggedReducer,
        taskReducer,
        profileReducer,
        connectionsReducer,
    },
});

export default store;
