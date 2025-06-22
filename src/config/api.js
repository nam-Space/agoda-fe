import axios from "config/axios.customize";

// user
export const callLogin = ({ username, password }) => {
    return axios.post(`/api/auth/token/`, {
        username,
        password,
    });
};

export const callRegister = (data) => {
    return axios.post(`/api/auth/accounts/register/`, {
        ...data
    });
};

export const callGetAccount = (config) => {
    return axios.get(`/api/auth/accounts/auth/profile/`, config);
}

export const callLogout = () => {
    return axios.post(`/api/auth/auth/logout`);
};