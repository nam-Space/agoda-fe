import axiosBase from 'axios';
import axios from "config/axios.customize";

// user
export const callLogin = ({ username, password }) => {
    return axios.post(`/api/accounts/login/`, {
        username,
        password,
    });
};

export const callRegister = (data) => {
    return axios.post(`/api/accounts/register/`, {
        ...data
    });
};

export const callGetAccount = (config) => {
    return axios.get(`/api/accounts/profile/`, config);
}

export const callRefreshToken = (data) => {
    return axios.post(`/api/accounts/refresh-token/`, { ...data });
}

export const callLogout = (data) => {
    return axios.post(`/api/accounts/logout/`, { ...data });
};

export const callFetchUser = (query) => {
    return axios.get(`/api/accounts/users?${query}`);
};

export const callCreateUser = (user) => {
    return axios.post("/api/accounts/users/create/", { ...user });
};

export const callUpdateUser = (id, user) => {
    return axios.put(`/api/accounts/users/${id}/update/`, { ...user });
};

export const callDeleteUser = (id) => {
    return axios.delete(`/api/accounts/users/${id}/delete/`);
};

export const callUploadSingleImage = ({ file, type }) => {
    const bodyFormData = new FormData();
    bodyFormData.append("image", file);
    return axios({
        method: "post",
        url: `/api/images/upload-image/?type=${type}`,
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

// City
export const callFetchCity = (query) => {
    return axios.get(`/api/cities/cities/?${query}`);
};

export const getTopVietNamHotel = (params) => {
    return axios.get("/api/cities/cities/top-vietnam", { params });
};

export const getTopAbroadHotel = (params) => {
    return axios.get("/api/cities/cities/top-abroad", { params });
};

export const callCreateCity = (data) => {
    return axios.post("/api/cities/cities/create/", { ...data });
};

export const callUpdateCity = (id, data) => {
    return axios.put(`/api/cities/cities/${id}/update/`, { ...data });
};

export const callDeleteCity = (id) => {
    return axios.delete(`/api/cities/cities/${id}/delete/`);
};

// Hotel
export const callFetchHotel = (params) => {
    return axios.get("/api/hotels/hotels/", { params });
};

export const callFetchHotelQuery = (query) => {
    return axios.get(`/api/hotels/hotels/?${query}`);
};

export const callCreateHotel = (data) => {
    return axios.post("/api/hotels/hotels/create/", { ...data });
};

export const callUpdateHotel = (id, data) => {
    return axios.put(`/api/hotels/hotels/${id}/update/`, { ...data });
};

export const callDeleteHotel = (id) => {
    return axios.delete(`/api/hotels/hotels/${id}/delete/`);
};

export const callDeleteHotelImage = (id) => {
    return axios.delete(`/api/hotels/hotel-images/${id}/delete/`);
};

/* Airport */
export const callFetchAirport = (query) => {
    return axios.get(`/api/airports/airports/?${query}`);
};

export const callCreateAirport = (data) => {
    return axios.post("/api/airports/airports/create/", { ...data });
};

export const callUpdateAirport = (id, data) => {
    return axios.put(`/api/airports/airports/${id}/update/`, { ...data });
};

export const callDeleteAirport = (id) => {
    return axios.delete(`/api/airports/airports/${id}/delete/`);
};

// Car
export const callFetchCar = (query) => {
    return axios.get(`/api/cars/cars/?${query}`);
};

export const callCreateCar = (data) => {
    return axios.post("/api/cars/cars/create/", { ...data });
};

export const callUpdateCar = (id, data) => {
    return axios.put(`/api/cars/cars/${id}/update/`, { ...data });
};

export const callDeleteCar = (id) => {
    return axios.delete(`/api/cars/cars/${id}/delete/`);
};

/* Get location Map in all world */
export const callFetchLocationMapInAllWorld = (query) => {
    return axiosBase.get(`https://photon.komoot.io/api/?q=${query}`);
};

// Activity
export const callFetchActivity = (query) => {
    return axios.get(`/api/activities/activities/?${query}`);
};

export const callFetchDetailActivity = (id) => {
    return axios.get(`/api/activities/activities/${id}/`);
};


export const callCreateActivity = (data) => {
    return axios.post("/api/activities/activities/create/", { ...data });
};

export const callUpdateActivity = (id, data) => {
    return axios.put(`/api/activities/activities/${id}/update/`, { ...data });
};

export const callDeleteActivity = (id) => {
    return axios.delete(`/api/activities/activities/${id}/delete/`);
};

export const callDeleteActivityImage = (id) => {
    return axios.delete(`/api/activities/activity-images/${id}/delete/`);
};


// Activity Package
export const callFetchActivityPackage = (query) => {
    return axios.get(`/api/activities/activities-packages/?${query}`);
};

export const callFetchActivityPackageByActivityIdAndDateLaunch = (query) => {
    return axios.get(`/api/activities/activities-packages/activity-and-date-launch/?${query}`);
};


export const callCreateActivityPackage = (data) => {
    return axios.post("/api/activities/activities-packages/create/", { ...data });
};

export const callUpdateActivityPackage = (id, data) => {
    return axios.put(`/api/activities/activities-packages/${id}/update/`, { ...data });
};

export const callDeleteActivityPackage = (id) => {
    return axios.delete(`/api/activities/activities-packages/${id}/delete/`);
};

// Activity date booking
export const callFetchDetailActivityDateBooking = (id) => {
    return axios.get(`/api/activities/activities-dates-booking/${id}/`);
};


// Promotion
export const getPromotions = (params) => {
    return axios.get("/api/promotions/", { params });
};

//Country
export const getCountries = (params) => {
    return axios.get("/api/countries/countries/", { params });
};

// City
export const getCities = (params) => {
    return axios.get("/api/cities/cities/", { params });
};

// Get room detail
export const getRoomDetail = (id) => {
    return axios.get(`/api/rooms/rooms/${id}/`);
};

// Booking
export const callBook = (data) => {
    return axios.post("/api/bookings/", data);
};

export const addBookingContact = (bookingId, data) => {
    return axios.patch(`/api/bookings/${bookingId}/`, data);
};

export const getBookingDetail = (id) => {
    return axios.get(`/api/bookings/${id}/`);
};

// Payment
export const createPayment = (data) => {
    return axios.post("/api/payments/", data);
};

export const getPayment = (bookingId) => {
    return axios.get(`/api/payments?booking_id=${bookingId}`);
};

export const payWithStripe = (paymentId, data) => {
    return axios.post(`/api/payments/${paymentId}/pay/`, data);
};

export const confirmCashPayment = (paymentId) => {
    return axios.post(`/api/payments/${paymentId}/confirm_cash/`);
};

export const capturePayment = (paymentId) => {
    return axios.post(`/api/payments/${paymentId}/capture/`);
};


// Hotels API
export const callGetHotels = ({ cityId, currentPage = 1, pageSize = 10, filters = {} }) => {
    const params = new URLSearchParams({
        current: currentPage,
        pageSize: pageSize,
        ...filters
    });

    if (cityId) {
        params.append('cityId', cityId);
    }

    return axios.get(`/api/hotels/hotels/?${params.toString()}`);
};

export const callGetHotelDetail = (hotelId) => {
    return axios.get(`/api/hotels/hotels/${hotelId}/`);
};


// Chat
export const callFetchConversation = (query) => {
    return axios.get(`/api/chats/conversations/?${query}`);
};

export const callGetOrCreateConversation = (data) => {
    return axios.post(`/api/chats/conversations/get_or_create/`, { ...data });
};

export const callFetchMessage = (conversationId) => {
    return axios.get(`/api/chats/messages/${conversationId}/`);
}

export const callFetchRoomQuery = (query) => {
    return axios.get(`/api/rooms/rooms/?${query}`);
};

export const callGetRoomDetail = (roomId) => {
    return axios.get(`/api/rooms/rooms/${roomId}/`);
};