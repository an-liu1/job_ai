import axios from "axios";
import Vue from "vue";

export const mainDomain =
  process.env.VUE_APP_API_URL || "http://127.0.0.1:8000/";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Authorization");
    if (token) {
      config.headers.Authorization = token;
    }
    config.timeout = 10 * 1000;
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => {
    if (response.data.code === 0) {
      return response.data;
    }
    return Promise.reject(response.data);
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.clear();
        sessionStorage.clear();
        if (Vue.$router) {
          Vue.$router.push("/login");
        }
      }
    }
    return Promise.reject(error);
  }
);

export default function request(method, address, data = null) {
  const url = `${mainDomain}${address}`;
  method = method.toLowerCase();

  const methods = ["post", "get", "delete", "put"];
  if (!methods.includes(method)) {
    throw new Error(`Invalid method: ${method}`);
  }

  return axios({
    method,
    url,
    ...(data && { data }),
  });
}
