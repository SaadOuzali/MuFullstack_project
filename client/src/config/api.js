import axios from "axios";

export const mainAxiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: "include",
});
