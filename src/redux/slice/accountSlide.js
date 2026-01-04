import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callGetAccount } from "config/api";
import Cookies from "js-cookie";
// First, create the thunk
export const fetchAccount = createAsyncThunk(
    "account/fetchAccount",
    async () => {
        const response = await callGetAccount();
        return response;
    }
);

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    isRefreshToken: false,
    errorRefreshToken: "",
    user: {
        id: 0,
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        birthday: null,
        phone_number: "",
        gender: "",
        avatar: "",
        role: "",
        manager: null,
        hotel_staffs: [],
        hotel: null,
        chatbot_id: null,
    },

    activeMenu: "home",
};

export const accountSlide = createSlice({
    name: "account",
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setActiveMenu: (state, action) => {
            state.activeMenu = action.payload;
        },
        setUserLoginInfo: (state, action) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.user.id = action?.payload?.id;
            state.user.username = action?.payload?.username;
            state.user.email = action.payload.email;
            state.user.first_name = action.payload.first_name;
            state.user.last_name = action.payload.last_name;
            state.user.birthday = action.payload.birthday;
            state.user.phone_number = action.payload.phone_number;
            state.user.gender = action.payload.gender;
            state.user.avatar = action.payload?.avatar;
            state.user.role = action.payload.role;
            state.user.manager = action.payload.manager;
            state.user.hotel_staffs = action.payload.hotel_staffs;
            state.user.hotel = action.payload.hotel;
            state.user.chatbot_id = action.payload.chatbot_id;
        },
        setLogoutAction: (state, action) => {
            localStorage.removeItem("access_token_agoda");
            Cookies.remove('refresh_token_agoda');
            state.isAuthenticated = false;
            state.user = {
                id: 0,
                username: "",
                email: "",
                first_name: "",
                last_name: "",
                birthday: null,
                phone_number: "",
                gender: "",
                avatar: "",
                role: "",
                manager: null,
                hotel_staffs: [],
                hotel: null,
                chatbot_id: null,
            };
        },
        setRefreshTokenAction: (state, action) => {
            state.isRefreshToken = action.payload?.status ?? false;
            state.errorRefreshToken = action.payload?.message ?? "";
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchAccount.pending, (state, action) => {
            state.isAuthenticated = false;
            state.isLoading = true;
        });

        builder.addCase(fetchAccount.fulfilled, (state, action) => {
            if (action.payload?.isSuccess) {
                state.isAuthenticated = true;
                state.isLoading = false;
                state.user.id = action.payload.data?.id;
                state.user.username = action.payload.data?.username;
                state.user.email = action.payload.data?.email;
                state.user.first_name = action.payload.data?.first_name;
                state.user.last_name = action.payload.data?.last_name;
                state.user.birthday = action.payload.data?.birthday;
                state.user.phone_number = action.payload.data?.phone_number;
                state.user.gender = action.payload.data?.gender;
                state.user.avatar = action.payload.data?.avatar;
                state.user.role = action.payload.data?.role;
                state.user.manager = action.payload.data?.manager;
                state.user.hotel_staffs = action.payload.data?.hotel_staffs;
                state.user.hotel = action.payload.data?.hotel;
                state.user.chatbot_id = action.payload.data?.chatbot_id;
            } else {
                state.isAuthenticated = false;
                state.isLoading = false;
            }
        });

        builder.addCase(fetchAccount.rejected, (state, action) => {
            if (action.payload) {
                state.isAuthenticated = false;
                state.isLoading = false;
            }
        });
    },
});

export const {
    setActiveMenu,
    setUserLoginInfo,
    setLogoutAction,
    setRefreshTokenAction,
} = accountSlide.actions;

export default accountSlide.reducer;
