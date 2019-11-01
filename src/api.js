import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api"
});

instance.interceptors.request.use(config => {
  let token = localStorage.getItem("token");
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;
