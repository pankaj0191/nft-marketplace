import { UserDataProps } from "@types";
import axios from "axios";
import { getIPFSBaseUrl } from "helpers/web3";
import { getBaseUrl } from "../helpers/axios";
import { SITE_COLORS } from "../utils";

export const getUsers = async (options = {}) => {
    options = typeof options === "object" && options ? options : {};
    let results = await axios.get(getBaseUrl("/api/users"), {
        params: options
    })
        .then((result: any) => result.data.data.users)
        .catch((error: any) => {
            console.error(error.response.data.message || error.message)
            return [];
        });

    return results.map((data: UserDataProps) => {
        return formatUserData(data);
    }).filter((user: UserDataProps) => user);
}

export const getUserById = async (userId: string) => {
    let result = await axios.get(
        getBaseUrl(`/api/users/${userId}`)
    )
        .then((result: any) => result.data.data)
        .catch((error: any) => {
            console.error(error.response.data.message || error.message)
            return false;
        });
    return formatUserData(result);
}


export const formatUserData = (data: any) => {
    if (data && Object.keys(data).length) {
        return {
            id: data._id || data.id,
            name: data.name || "noname",
            address: data.ethAddress,
            username: data.username,
            description: data.description || "",
            socialLinks: data.socialLinks || {},
            banner: getIPFSBaseUrl(data.banner || ""),
            image: getIPFSBaseUrl(data.image || ""),
            theme: data.theme || "light",
            authData: data.authData,
            isVarified: data.isVarified,
            status: data.status,
            colors: data.colors || SITE_COLORS(),
            isFollowed: data.isLiked?.shift()?.count ? true : false,
            ownedNftCount: typeof data.ownedNft !== "undefined" ? data.ownedNft.shift()?.count || 0 : 0,
            createdNftCount: typeof data.createdNft !== "undefined" ? data.createdNft.shift()?.count || 0 : 0,
            collectionCount: typeof data.collections !== "undefined" ? data.collections.shift()?.count || 0 : 0,
            followers: typeof data.followers !== "undefined" ? data.followers.shift()?.count || 0 : 0,
            followings: typeof data.followings !== "undefined" ? data.followings.shift()?.count || 0 : 0,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        }
    }
    return {}
}

export const formatChildUserData = (data: any) => {
    return formatUserData(data);
}

export const updateUserData = async (userId: string, params = {}) => {
    params = typeof params === "object" && params ? params : {};
    let results = await axios({
        method: 'put',
        url: getBaseUrl(`/api/users/${userId}`),
        data: params
    })
        .then((result: any) => result.data)
        .catch((error: any) => {
            const message = error.response.data.message || error.message;
            console.error(message)
            return {
                status: "error",
                message
            };
        });

    return results;
}


export const saveUserFollow = async (userId: string) => {
    let results = await axios({
        method: 'POST',
        url: getBaseUrl(`/api/users/${userId}/follow`),
    })
        .then((result: any) => result.data)
        .catch((error: any) => {
            const message = error.response.data.message || error.message;
            console.error(message)
            return {
                status: "error",
                message
            };
        });

    return results;
}


export const userUnfollow = async (userId: string) => {
    let results = await axios({
        method: 'DELETE',
        url: getBaseUrl(`/api/users/${userId}/unfollow`),
    })
        .then((result: any) => result.data)
        .catch((error: any) => {
            const message = error.response.data.message || error.message;
            console.error(message)
            return {
                status: "error",
                message
            };
        });

    return results;
}

export const getFollower = async (userId: string) => {
    let results = await axios({
        method: 'GET',
        url: getBaseUrl(`/api/users/${userId}/getfollowed`),
    })
        .then((result: any) => result.data)
        .catch((error: any) => {
            const message = error.response.data.message || error.message;
            console.error(message)
            return {
                status: "error",
                message
            };
        });

    return results.data;
}