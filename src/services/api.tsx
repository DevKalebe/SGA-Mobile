import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.0.156:8080",
});

export default API;
