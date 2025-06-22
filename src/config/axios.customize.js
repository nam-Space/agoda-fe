
import axios from "axios";
const instance = axios.create({
    baseURL: process.env.REACT_APP_BE_URL,
    timeout: 60 * 1000, //60s
});

// Add a request interceptor
instance.interceptors.request.use(
    async function (config) {
        // Do something before request is sent
        // config.headers["delay"] = 3000;
        const access_token = JSON.parse(localStorage.getItem('currentUser-agoda'))?.access
        if (access_token) {
            config.headers["Authorization"] = `Bearer ${access_token}`;
        }
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
instance.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        if (response.data) return response.data;
        return response;
    },
    function (error) {
        if (error?.response?.data) return error?.response?.data;
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
    }
);

export default instance;
