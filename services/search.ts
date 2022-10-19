import { getBaseUrl } from "../helpers/axios";
import axios from "axios";
import { formatUserData, formatCollectionData, formatNftData } from ".";

export const getAllSearch = async (options = {}) => {
    options = typeof options === "object" && options ? options : {};
    let results = await axios.get(getBaseUrl(`/api/search`), {
        params: options
    })
        .then(result => result.data.data)
        .catch(error => {
            const message = error.response.data.message || error.message;
            console.log(message);
            return {
                status: "error",
                message,
                collections: [],
                nfts: [],
                users: []
            };
        });

    return await formatSearchData(results);
}

const formatSearchData = async (result: any) => {
    const data: any = {
        collections: [],
        nfts: [],
        users: []
    }

    // Get collections by search
    if (result.collections.length) {
        data.collections = result.collections.map((collection: any) => {
            return formatCollectionData(collection);
        });
    }

    // Get NFT items by search
    if (result.nfts.length) {
        const nftResults = await result.nfts.map(async (nft: any) => await formatNftData(nft));
        data.nfts = await Promise.all(nftResults.map(async (res: any) => res))
    }

    // Get users/creators/artists by search
    if (result.users.length) {
        data.users = result.users.map((user: any) => formatUserData(user));
    }

    return data;

}

