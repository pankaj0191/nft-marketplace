import { getBaseUrl } from "../helpers/axios";
import axios from "axios";

import { CollectionDataProps } from "../@types";
import { formatUserData } from "./users";
import { getIPFSBaseUrl } from "helpers/web3";

export const getCollections = async (options = {}) => {
    options = typeof options === "object" && options ? options : {};
    let results = await axios.get(getBaseUrl("/api/collections"), {
        params: options
    })
        .then(result => result.data.data.collections)
        .catch(error => {
            console.error(error.response.data.message || error.message)
            return [];
        });

    return results.map((data: CollectionDataProps) => {
        return formatCollectionData(data);
    });
}

export const getCollectionById = async (collectionId: any) => {
    let result = await axios.get(
        getBaseUrl(`/api/collections/${collectionId}`)
    )
        .then(result => result.data.data)
        .catch(error => {
            console.error(error.response.data.message || error.message)
            return false;
        });
    if(result) {
        return formatCollectionData(result);
    }
    return false;
}

export const getCollectionDetails = async (collectionId: any, options = {}) => {
    options = typeof options === "object" && options ? options : {};
    let results = await axios.get(getBaseUrl(`/api/collections/${collectionId}/details`), {
        params: options
    })
        .then(result => result.data.data)
        .catch(error => {
            console.error(error.response.data.message || error.message)
            return {};
        });


    return results;
}

export const addCollectionDetails = async (collectionId: any, options = {}) => {
    options = typeof options === "object" && options ? options : {};
    let results = await axios.post(getBaseUrl(`/api/collections/${collectionId}/add`), {
        params: options
    })
        .then(result => result.data.data)
        .catch(error => {
            console.error(error.response.data.message || error.message)
            return {};
        });


    return results;
}

export const formatCollectionData = (data: CollectionDataProps) => {
    if(data && Object.keys(data).length) { 
        return {
            id: data._id || data.id,
            name: data.name || "noname",
            symbol: data.symbol,
            category: data.category || {},
            genre: data.genre || {},
            contractAddress: data.contractAddress,
            description: data.description || "",
            socialLinks: data.socialLinks || {},
            image: getIPFSBaseUrl(data.image),
            featuredImage: getIPFSBaseUrl(data.feature),
            banner: getIPFSBaseUrl(data.banner),
            explicitSensitivity: data.explicitSensitiveContent || false,
            collaborators: data.collaborators || [],
            slug: data.slug || "",
            isVarified: data.isVarified || false,
            transaction: data.transactions,
            creator: formatUserData(data.creator),
            nftCount: data?.nfts?.shift()?.count || 0,
            createdBy: data.createdBy,
            updatedBy: data.updatedBy,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        }
    }
    return {};
}

export const saveCollection = async (params = {}) => {
    params = typeof params === "object" && params ? params : {};
    let results = await axios({
        method: 'post',
        url: getBaseUrl(`/api/collections`),
        data: params
    })
        .then(result => result.data)
        .catch(error => {
            console.error(error.response.data.message || error.message)
            return {
                status: "error",
                message: error.message
            };
        });

    return results;
}

export const updateCollection = async (collectionId: any, params = {}) => {
    params = typeof params === "object" && params ? params : {};
    let results = await axios({
        method: 'put',
        url: getBaseUrl(`/api/collections/${collectionId}`),
        data: params
    })
        .then(result => result.data)
        .catch(error => {
            console.error(error.response.data.message || error.message)
            return {};
        });

    return results;
}