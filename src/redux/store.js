import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import accountSlide from "./slice/accountSlide";
import citySlide from "./slice/citySlide";
import activitySlide from "./slice/activitySlide";
import hotelSlice from "./slice/hotelSlice";

export const store = configureStore({
    reducer: {
        account: accountSlide,
        city: citySlide,
        activity: activitySlide,
        hotel: hotelSlice, // Thêm hotel reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});