import axios from "axios";
import { getBaseUrl } from "../helpers/axios";

export const getCategories = async (options = {}) => {
    options = typeof options === "object" && options ? options : {};
    let result = await axios.get(getBaseUrl("/api/categories"), {
        params: options
    })
        .then(result => result.data.data.categories)
        .catch(error => {
            console.error(error.response.data.message || error.message)
            return [];
        });

    return result.map((category: any) => categoryFormat(category));
}

export const categoryFormat = (data: any) => {
    if(data && Object.keys(data).length) {
        data.id = data._id;
        delete data._id;
        return data;
    }
    return {};
}