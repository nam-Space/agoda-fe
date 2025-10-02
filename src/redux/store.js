import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import accountSlide from "./slice/accountSlide";
import citySlide from "./slice/citySlide";
import activitySlide from "./slice/activitySlide";

export const store = configureStore({
    reducer: {
        account: accountSlide,
        city: citySlide,
        activity: activitySlide
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});