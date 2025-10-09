import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import accountSlide from "./slice/accountSlide";
import citySlide from "./slice/citySlide";
import activitySlide from "./slice/activitySlide";
import hotelSlice from "./slice/hotelSlide";
import userSlice from "./slice/userSlide";
import conversationSlice from "./slice/conversationSlide";

export const store = configureStore({
    reducer: {
        account: accountSlide,
        city: citySlide,
        activity: activitySlide,
        hotel: hotelSlice, // Thêm hotel reducer
        user: userSlice,
        conversation: conversationSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});