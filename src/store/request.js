import axios from "axios";
import router from "../router";
import store from "../store";

export const mainDomain = "https://jobcoach.top/api/";
// process.env.VUE_APP_API_URL || "http://127.0.0.1:8000/";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Authorization");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.url.endsWith("/jobapp/chat/")) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else if (config.url.endsWith("/auth/google/callback/")) {
      config.headers["Content-Type"] = "application/x-www-form-urlencoded";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    config.timeout = 10000 * 1000;
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => {
    if (response.status == 200 || response.status == 201) {
      return response.data;
    }
    return Promise.reject(response.data);
  },
  (error) => {
    if (error.response) {
      if (error.response.status == 401) {
        localStorage.clear();
        sessionStorage.clear();
        store.commit("setLoginStatus", false);
        store.commit("setLogininFrom", "/account");
        router.push("/signinup");
        return Promise.resolve();
      }
      store.commit("switchLoadingStatus", false);
    }
    store.commit("switchLoadingStatus", false);
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
