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