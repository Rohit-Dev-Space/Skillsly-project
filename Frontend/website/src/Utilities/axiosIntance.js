import axios from "axios";

const axiosinstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

axiosinstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(import.meta.env.VITE_API_URL)
        return config;
    },
    (error) => Promise.reject(error)
);

axiosinstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response?.status === 403 &&
            error.response.data?.blocked
        ) {
            const blockedUserData = {
                blockedAt: error.response.data.blockedAt,
            };
            localStorage.setItem("blockedUser", JSON.stringify(blockedUserData));

            localStorage.removeItem("token");
        }
        return Promise.reject(error);
    }
);

export default axiosinstance;
