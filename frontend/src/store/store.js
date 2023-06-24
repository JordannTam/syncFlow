import { configureStore } from "@reduxjs/toolkit";
import loggedReducer from "../reducers/isLogged";
import taskReducer from "../reducers/tasks";

const store = configureStore({
    // Automatically calls `combineReducers`
    reducer: {
        loggedReducer,
        taskReducer,
    },
});

export default store;
