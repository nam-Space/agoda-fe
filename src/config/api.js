import axiosBase from 'axios'
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

// Hotel
export const callFetchHotel = (params) => {
    return axios.get("/api/hotels/hotels/", { params });
};

export const callCreateHotel = (data) => {
    return axios.post("/api/hotels/hotels/create/", { ...data });
};

export const getTopVietNamHotel = (params) => {
    return axios.get("/api/cities/cities/top-vietnam", { params });
};

export const getTopAbroadHotel = (params) => {
    return axios.get("/api/cities/cities/top-abroad", { params });
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

// Promotion
export const getPromotions = (params) => {
    return axios.get("/api/promotions/", { params });
};

// City
export const getCities = (params) => {
    return axios.get("/api/cities/cities/", { params });
};