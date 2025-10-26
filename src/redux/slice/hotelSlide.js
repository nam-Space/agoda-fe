// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { callGetHotels, callGetHotelDetail } from "config/api";

// // Async thunk để fetch hotels theo city ID
// export const fetchHotelsByCity = createAsyncThunk(
//     "hotel/fetchHotelsByCity",
//     async ({ cityId, currentPage = 1, pageSize = 10, filters = {} }) => {
//         const response = await callGetHotels({ 
//             cityId, 
//             currentPage, 
//             pageSize, 
//             filters 
//         });
//         return response;
//     }
// );

// // Async thunk để fetch hotel detail
// export const fetchHotelDetail = createAsyncThunk(
//     "hotel/fetchHotelDetail",
//     async (hotelId) => {
//         const response = await callGetHotelDetail(hotelId);
//         return response;
//     }
// );

// const initialState = {
//     // Hotels list
//     hotels: [],
//     isLoadingHotels: false,
//     totalHotels: 0,
//     currentPage: 1,
//     pageSize: 10,
//     totalPages: 0,

//     // Hotel detail
//     hotelDetail: null,
//     isLoadingHotelDetail: false,

//     // Filters & Sort
//     filters: {},
//     sortBy: 0,

//     // Error handling
//     error: null,
// };

// export const hotelSlice = createSlice({
//     name: "hotel",
//     initialState,
//     reducers: {
//         // Set filters
//         setFilters: (state, action) => {
//             state.filters = { ...state.filters, ...action.payload };
//         },

//         // Clear filters
//         clearFilters: (state) => {
//             state.filters = {};
//         },

//         // Set sort option
//         setSortBy: (state, action) => {
//             state.sortBy = action.payload;
//         },

//         // Set current page
//         setCurrentPage: (state, action) => {
//             state.currentPage = action.payload;
//         },

//         // Set page size
//         setPageSize: (state, action) => {
//             state.pageSize = action.payload;
//         },

//         // Clear hotel detail
//         clearHotelDetail: (state) => {
//             state.hotelDetail = null;
//         },

//         // Clear error
//         clearError: (state) => {
//             state.error = null;
//         }
//     },
//     extraReducers: (builder) => {
//         // Fetch hotels by city
//         builder
//             .addCase(fetchHotelsByCity.pending, (state) => {
//                 state.isLoadingHotels = true;
//                 state.error = null;
//             })
//             .addCase(fetchHotelsByCity.fulfilled, (state, action) => {
//                 state.isLoadingHotels = false;
//                 if (action.payload?.isSuccess) {
//                     state.hotels = action.payload.data || [];
//                     state.totalHotels = action.payload.meta?.totalItems || 0;
//                     state.currentPage = action.payload.meta?.currentPage || 1;
//                     state.pageSize = action.payload.meta?.itemsPerPage || 10;
//                     state.totalPages = action.payload.meta?.totalPages || 0;
//                 } else {
//                     state.error = action.payload?.message || "Failed to fetch hotels";
//                 }
//             })
//             .addCase(fetchHotelsByCity.rejected, (state, action) => {
//                 state.isLoadingHotels = false;
//                 state.error = action.error?.message || "Failed to fetch hotels";
//                 state.hotels = [];
//             });

//         // Fetch hotel detail
//         builder
//             .addCase(fetchHotelDetail.pending, (state) => {
//                 state.isLoadingHotelDetail = true;
//                 state.error = null;
//             })
//             .addCase(fetchHotelDetail.fulfilled, (state, action) => {
//                 state.isLoadingHotelDetail = false;
//                 if (action.payload?.isSuccess) {
//                     state.hotelDetail = action.payload.data;
//                 } else {
//                     state.error = action.payload?.message || "Failed to fetch hotel detail";
//                 }
//             })
//             .addCase(fetchHotelDetail.rejected, (state, action) => {
//                 state.isLoadingHotelDetail = false;
//                 state.error = action.error?.message || "Failed to fetch hotel detail";
//                 state.hotelDetail = null;
//             });
//     },
// });

// export const {
//     setFilters,
//     clearFilters,
//     setSortBy,
//     setCurrentPage,
//     setPageSize,
//     clearHotelDetail,
//     clearError
// } = hotelSlice.actions;

// export default hotelSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callGetHotels, callGetHotelDetail } from "config/api";

// Async thunk để fetch hotels theo city ID
export const fetchHotelsByCity = createAsyncThunk(
    "hotel/fetchHotelsByCity",
    async ({ cityId, currentPage = 1, pageSize = 10, filters = {} }) => {
        const response = await callGetHotels({
            cityId,
            currentPage,
            pageSize,
            filters
        });
        return response;
    }
);

// Async thunk để fetch hotel detail
export const fetchHotelDetail = createAsyncThunk(
    "hotel/fetchHotelDetail",
    async (hotelId) => {
        const response = await callGetHotelDetail(hotelId);
        return response;
    }
);

const initialState = {
    // Hotels list
    hotels: [],
    isLoadingHotels: false,
    totalHotels: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,

    // Hotel detail
    hotelDetail: null,
    isLoadingHotelDetail: false,

    // Filters & Sort
    filters: {},
    sortBy: 0,

    // Error handling
    error: null,
};

export const hotelSlice = createSlice({
    name: "hotel",
    initialState,
    reducers: {
        // Set filters
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },

        // Clear filters
        clearFilters: (state) => {
            state.filters = {};
        },

        // Set sort option
        setSortBy: (state, action) => {
            state.sortBy = action.payload;
        },

        // Set current page
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },

        // Set page size
        setPageSize: (state, action) => {
            state.pageSize = action.payload;
        },

        // Clear hotel detail
        clearHotelDetail: (state) => {
            state.hotelDetail = null;
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch hotels by city
        builder
            .addCase(fetchHotelsByCity.pending, (state) => {
                state.isLoadingHotels = true;
                state.error = null;
            })
            .addCase(fetchHotelsByCity.fulfilled, (state, action) => {
                state.isLoadingHotels = false;
                if (action.payload?.isSuccess) {
                    state.hotels = action.payload.data || [];
                    state.totalHotels = action.payload.meta?.totalItems || 0;
                    state.currentPage = action.payload.meta?.currentPage || 1;
                    state.pageSize = action.payload.meta?.itemsPerPage || 10;
                    state.totalPages = action.payload.meta?.totalPages || 0;
                } else {
                    state.error = action.payload?.message || "Failed to fetch hotels";
                }
            })
            .addCase(fetchHotelsByCity.rejected, (state, action) => {
                state.isLoadingHotels = false;
                state.error = action.error?.message || "Failed to fetch hotels";
                state.hotels = [];
            });

        // Fetch hotel detail
        builder
            .addCase(fetchHotelDetail.pending, (state) => {
                state.isLoadingHotelDetail = true;
                state.error = null;
            })
            .addCase(fetchHotelDetail.fulfilled, (state, action) => {
                state.isLoadingHotelDetail = false;
                if (action.payload?.isSuccess) {
                    state.hotelDetail = action.payload.data;
                } else {
                    state.error = action.payload?.message || "Failed to fetch hotel detail";
                }
            })
            .addCase(fetchHotelDetail.rejected, (state, action) => {
                state.isLoadingHotelDetail = false;
                state.error = action.error?.message || "Failed to fetch hotel detail";
                state.hotelDetail = null;
            });
    },
});

export const {
    setFilters,
    clearFilters,
    setSortBy,
    setCurrentPage,
    setPageSize,
    clearHotelDetail,
    clearError
} = hotelSlice.actions;

export default hotelSlice.reducer;