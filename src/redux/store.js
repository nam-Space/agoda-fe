import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import accountSlide from "./slice/accountSlide";

export const store = configureStore({
    reducer: {
        account: accountSlide,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});