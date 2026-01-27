import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import { baseApi } from "./baseApi";

export const store = configureStore({
  reducer: {
    // service reducers
    [baseApi.reducerPath]: baseApi.reducer,

    // Regular reducers
    auth: authReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
