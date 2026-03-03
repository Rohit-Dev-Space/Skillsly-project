import axios from "axios";

const axiosinstance = axios.create({
    baseURL: "http://localhost:5000",
});

axiosinstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
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

            // Optional: remove token so all requests fail immediately
            localStorage.removeItem("token");
        }
        return Promise.reject(error);
    }
);

export default axiosinstance;
