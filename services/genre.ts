import axios from "axios";
import { getBaseUrl } from "../helpers/axios";

export const getGenries = async (options = {}) => {
    options = typeof options === "object" && options ? options : {};
    let result = await axios.get(getBaseUrl("/api/genries"), {
        params: options
    })
        .then(result => result.data.data.genries)
        .catch(error => {
            console.error(error.response.data.message || error.message)
            return [];
        });

    return result.map((genre: any) => genreFormat(genre));
}

export const genreFormat = (data: any) => {
    if (data && Object.keys(data).length) {
        data.id = data._id;
        delete data._id;
        return data;
    }
    return {};
}