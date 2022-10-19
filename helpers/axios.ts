
import axios from "axios";
import { APP_BASE_URL } from "utils";


export const getBaseUrl = (url: string = "") => {
    url = typeof url === "string" ? url.trim() : "";
    let baseURL = APP_BASE_URL || "";
    baseURL = baseURL && baseURL.slice(-1) === "/" ? baseURL.slice(0, -1) : baseURL;
    return url && url.slice(0) == "/" ? `${baseURL.trim()}/${url.slice(1)}` : `${baseURL}/${url}`;
}

export const axiosInstance = axios.create({
    baseURL: getBaseUrl("/"),
    timeout: 1000,
    headers: {
        "content-type": "application/json",
        accept: "application/json"
    }
});

export default {
    axiosInstance,
    getBaseUrl
}