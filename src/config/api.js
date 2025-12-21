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

// Fetch amenities của 1 phòng
export const callFetchAmenities = (query) => {
    return axios.get(`/api/rooms/amenities/?${query}`);
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

// Country
export const callFetchCountry = (query) => {
    return axios.get(`/api/countries/countries/?${query}`);
};

export const callFetchCountryDetail = (id) => {
    return axios.get(`/api/countries/countries/${id}/`);
};

export const callCreateCountry = (data) => {
    return axios.post("/api/countries/countries/create/", { ...data });
};

export const callUpdateCountry = (id, data) => {
    return axios.put(`/api/countries/countries/${id}/update/`, { ...data });
};

export const callDeleteCountry = (id) => {
    return axios.delete(`/api/countries/countries/${id}/delete/`);
};

// City
export const callFetchCity = (query) => {
    return axios.get(`/api/cities/cities/?${query}`);
};

export const callFetchCityDetail = (id) => {
    return axios.get(`/api/cities/cities/${id}/`);
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

export const callUpdateHotelNotImage = (id, data) => {
    return axios.put(`/api/hotels/hotels/${id}/update/not-image/`, { ...data });
};

export const callFetchDetailUserHotelInteractionByHotelId = (hotelId) => {
    return axios.get(`/api/hotels/user-hotel-interaction/${hotelId}/`);
};

export const callUpsertUserHotelInteraction = (data) => {
    return axios.post(`/api/hotels/user-hotel-interaction/upsert/`, { ...data });
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

export const callFetchDetailUserCarInteractionByCarId = (carId) => {
    return axios.get(`/api/cars/user-car-interaction/${carId}/`);
};

export const callUpsertUserCarInteraction = (data) => {
    return axios.post(`/api/cars/user-car-interaction/upsert/`, { ...data });
};

// Car booking detail
export const callFetchDetailCarBooking = (id) => {
    return axios.get(`/api/cars/cars-booking/${id}/`);
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

export const callFetchDetailUserActivityInteractionByActivityId = (activity) => {
    return axios.get(`/api/activities/user-activity-interaction/${activity}/`);
};

export const callUpsertUserActivityInteraction = (data) => {
    return axios.post(`/api/activities/user-activity-interaction/upsert/`, { ...data });
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

export const getPromotionsAdmin = (query) => {
    return axios.get(`/api/promotions/promotions-admin/?${query}`);
};

export const getPromotionDetail = (promotionId, params) => {
    return axios.get(`/api/promotions/${promotionId}/`, { params });
};

export const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${process.env.REACT_APP_BE_URL}${imagePath}`;
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

// room booking detail
export const callFetchDetailRoomBooking = (id) => {
    return axios.get(`/api/rooms/rooms-booking/${id}/`);
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

export const callSearchRoomQuery = (query) => {
    return axios.get(`/api/rooms/rooms/search/?${query}`);
}


// Review
export const callFetchReview = (query) => {
    return axios.get(`/api/reviews/reviews/?${query}`);
};

export const callFetchDetailReview = (id) => {
    return axios.get(`/api/reviews/reviews/${id}/`);
};


export const callCreateReview = (data) => {
    return axios.post("/api/reviews/reviews/create/", { ...data });
};

export const callUpdateReview = (id, data) => {
    return axios.put(`/api/reviews/reviews/${id}/update/`, { ...data });
};

export const callDeleteReview = (id) => {
    return axios.delete(`/api/reviews/reviews/${id}/delete/`);
};

// Airport
export const getAirports = (params) => {
    return axios.get("/api/airports/airports/", { params });
};

// Airline
export const getAirlines = () => {
    return axios.get('/api/airlines/');
};

// Flight
export const getFlights = (params) => {
    return axios.get('/api/flights/', { params });
};

export const callFetchFlight = (query) => {
    return axios.get(`/api/flights/flights-for-admin/?${query}`);
};

// Handbook
export const callFetchHandbook = (query) => {
    return axios.get(`/api/handbooks/handbooks/?${query}`);
};

export const callFetchHandbookDetail = (id) => {
    return axios.get(`/api/handbooks/handbooks/${id}/`);
};

export const callCreateHandbook = (data) => {
    return axios.post("/api/handbooks/handbooks/create/", { ...data });
};

export const callUpdateHandbook = (id, data) => {
    return axios.put(`/api/handbooks/handbooks/${id}/update/`, { ...data });
};

export const callDeleteHandbook = (id) => {
    return axios.delete(`/api/handbooks/handbooks/${id}/delete/`);
};

export const callFetchDetailUserHandbookInteractionByHandbookId = (handbookId) => {
    return axios.get(`/api/handbooks/user-handbook-interaction/${handbookId}/`);
};

export const callUpsertUserHandbookInteraction = (data) => {
    return axios.post(`/api/handbooks/user-handbook-interaction/upsert/`, { ...data });
};

// Payment
export const callFetchPayment = (query) => {
    return axios.get(`/api/payments/payments/?${query}`);
};

export const callFetchPaymentOverview = (query) => {
    return axios.get(`/api/payments/payments/overview/?${query}`);
};

export const callCreatePayment = (data) => {
    return axios.post("/api/payments/payments/create/", { ...data });
};

export const callUpdatePayment = (id, data) => {
    return axios.put(`/api/payments/payments/${id}/update/`, { ...data });
};

export const callDeletePayment = (id) => {
    return axios.delete(`/api/payments/payments/${id}/delete/`);
};

// Flight Promotion
export const callFetchFlightPromotion = (query) => {
    return axios.get(`/api/promotions/flight-promotions/?${query}`);
};

export const callCreateFlightPromotion = (data) => {
    return axios.post("/api/promotions/flight-promotions/create/", { ...data });
};

export const callUpdateFlightPromotion = (id, data) => {
    return axios.put(`/api/promotions/flight-promotions/${id}/update/`, {
        ...data,
    });
};

export const callDeleteFlightPromotion = (id) => {
    return axios.delete(`/api/promotions/flight-promotions/${id}/delete/`);
};

/* Flight leg */
export const callFetchFlightLeg = (query) => {
    return axios.get(`/api/flights/legs/?${query}`);
};

export const callCreateFlightLeg = (data) => {
    return axios.post("/api/flights/legs/", { ...data });
};

export const callUpdateFlightLeg = (id, data) => {
    return axios.put(`/api/flights/legs/${id}/`, { ...data });
};

export const callDeleteFlightLeg = (id) => {
    return axios.delete(`/api/flights/legs/${id}/`);
};

/* Seat class pricing */
export const callFetchSeatClassPricing = (query) => {
    return axios.get(`/api/flights/seat-classes/?${query}`);
};

export const callCreateSeatClassPricing = (data) => {
    return axios.post("/api/flights/seat-classes/", { ...data });
};

export const callUpdateSeatClassPricing = (id, data) => {
    return axios.put(`/api/flights/seat-classes/${id}/`, { ...data });
};

export const callDeleteSeatClassPricing = (id) => {
    return axios.delete(`/api/flights/seat-classes/${id}/`);
};