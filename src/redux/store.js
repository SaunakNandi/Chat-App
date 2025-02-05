import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth";
import api from "./api/api";
import miscSlice from "./reducers/misc";

const store=configureStore({
    reducer:{
        [authSlice.name]:authSlice.reducer,  // whatever be the name of authSlice it can be accessed  by authSlice.name
        [miscSlice.name]:miscSlice.reducer,

        // api.reducerPath is set as 'api', so this adds RTK Query’s reducer to the Redux store under the key api.
        // This stores API responses (caching, request states, etc.) in Redux.
        [api.reducerPath]:api.reducer
    },

        // defaultMiddleware() → Returns the default middleware used by Redux.
        // api.middleware → Enables RTK Query’s features:
        // Caching
        // Automatic refetching
        // Request lifecycle handling (loading, success, error)

    middleware:(defaultMiddleware)=>[...defaultMiddleware(),api.middleware]
})

export default store; 