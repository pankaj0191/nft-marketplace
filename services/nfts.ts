import { NftDataProps } from "@types";
import axios, { Method } from "axios";
import { getIPFSBaseUrl } from "helpers/web3";
import moment from "moment";
import { getBaseUrl } from "../helpers/axios";
import { categoryFormat } from "./category";
import { formatCollectionData } from "./collections";
import { genreFormat } from "./genre";

import { formatUserData } from "./users";

export const getAllItems = async (options = {}) => {
    options = typeof options === "object" && options ? options : {};
    let results = await axios.get(getBaseUrl("/api/nfts"), {
        params: options
    })
        .then(result => result.data.data.nfts)
        .catch(error => {
            console.error(error.response.data.message || error.message)
            return [];
        });

    const data = await results.map(async (data: NftDataProps) => await formatNftData(data));
    return await Promise.all(data.map(async (i: any) => await i));
}


export const getNftById = async (id: string, options = {}) => {
    options = typeof options === "object" && options ? options : {};
    let result = await axios.get(
        getBaseUrl(`/api/nfts/${id}`)
    )
        .then(result => result.data.data)
        .catch(error => {
            console.error(error.response.data.message || error.message)
            return false;
        });
    return await formatNftData(result);
}

export const formatNftData = async (data: any) => {
    if (!data && !Object.keys(data).length) { return false };
    let dollarPrice = 0;
    let price = customParseFloat(data.price, 4);
    if (price) {
        dollarPrice = await convertEthToDollar(price.toString());
    }
    const priceData = {
        eth: price,
        dollar: customParseFloat(dollarPrice)
    }
    const userSigner = {}
    let marketplace = {};
    if (data.marketplace?.type === "fixed_price") {
        marketplace = {
            action: data.marketplace.type,
            data: {
                price: priceData,
            }
        }
    } else if (data.marketplace?.type === "open_for_bids") {
        marketplace = {
            action: data.marketplace.type,
            data: {}
        }
    } else if (data.marketplace?.type === "timed_auction") {
        const ethMinBid: string = data.marketplace.minBid?.toString() || "0";
        const minBidDollarPrice = await convertEthToDollar(ethMinBid);
        marketplace = {
            action: data.marketplace.type,
            data: {
                minBid: {
                    eth: customParseFloat(ethMinBid, 4),
                    dollar: customParseFloat(minBidDollarPrice)
                },
                maxBid: {
                    eth: customParseFloat(ethMinBid, 4),
                    dollar: customParseFloat(minBidDollarPrice)
                },
                startDate: data.marketplace.startDate,
                endDate: data.marketplace.endDate
            }
        }
    }
    return {
        id: data._id || data.id,
        title: data.title,
        tokenId: data.tokenId,
        itemId: data.itemId,
        description: data.description || "",
        price: priceData,
        externalLink: data.externalLink || "",
        image: getIPFSBaseUrl(data.image || ""),
        asset: {
            file: getIPFSBaseUrl(data.image || ""),
            type: data.fileType
        },
        metadata: getIPFSBaseUrl(data.metadata || ""),
        properties: data.properties || [],
        transaction: data.transactions || {},
        onMarketPlace: data.onMarketPlace || false,
        marketplace: marketplace,
        collection: formatCollectionData(data.collection || {}),
        category: categoryFormat(data.category || {}),
        genre: genreFormat(data.genre || {}),
        explicitAndSensitiveContent: data.explicitAndSensitiveContent || false,
        createdBy: formatUserData(data.creator || {}),
        ownedBy: data.owner?.length ? formatUserData(data.owner.shift()) : false,
        viewCount: data.views?.shift()?.count || 0,
        likeCount: data.likes?.shift()?.count || 0,
        isLiked: data.isLiked?.shift()?.count > 0 ? true : false,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
    }
}

export const convertEthToDollar = async (ethPrice: string = "0") => {
    if (ethPrice <= "0") { return 0 };
    let result = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum')
        .then(response => response.json())
        .catch(error => {
            console.log(error)
            return [];
        });
    result = result.length ? result.shift() : false;
    if (result) {
        return parseFloat(ethPrice) * parseFloat(result.current_price);
    }

    return parseFloat(ethPrice);
}


export const saveNft = async (params = {}) => {
    params = typeof params === "object" && params ? params : {};
    let results = await axios({
        method: 'post',
        url: getBaseUrl(`/api/nfts`),
        data: params
    })
        .then(result => result.data)
        .catch(error => {
            console.error(error.response.data.message || error.message)
            return {
                status: "error",
                message: error.response.data.message || error.message
            };
        });

    return results;
}

export const listNftItem = async (id: string, params = {}) => {
    params = typeof params === "object" && params ? params : {};
    let results = await axios({
        method: 'PUT',
        url: getBaseUrl(`/api/nfts/${id}/sell`),
        data: params
    })
        .then(result => result.data)
        .catch(error => {
            console.error(error.response.data.message || error.message)
            return {
                status: "error",
                message: error.response.data.message || error.message
            };
        });

    return results;
}

export const saveNftLike = async (id: string) => {
    let results = await axios({
        method: 'POST',
        url: getBaseUrl(`/api/nfts/${id}/like`),
    })
        .then(result => result.data)
        .catch((error: any) => {
            const message = error?.response?.data?.message || error.message;
            console.error(message)
            return {
                status: "error",
                message
            };
        });

    return results;
}

// Unlike nft by user

export const unLikeNft = async (id: string) => {
    let results = await axios({
        method: 'DELETE',
        url: getBaseUrl(`/api/nfts/${id}/unlike`),
    })
        .then(result => result.data)
        .catch((error: any) => {
            const message = error?.response?.data?.message || error.message;
            console.error(message)
            return {
                status: "error",
                message
            };
        });

    return results;
}

export const buyNft = async (id: string, params = {}) => {
    params = typeof params === "object" && params ? params : {};
    let results = await axios({
        method: 'PUT',
        url: getBaseUrl(`/api/nfts/${id}/buy`),
        data: params
    })
        .then(result => result.data)
        .catch(error => {
            const message = error?.response?.data?.message || error.message;
            console.error(message)
            return {
                status: "error",
                message
            };
        });

    return results;
}

// remove Nft from nft listing

export const removeNftFromListing = async (id: string, params = {}) => {
    params = typeof params === "object" && params ? params : {};
    let results = await axios({
        method: 'PUT',
        url: getBaseUrl(`/api/nfts/${id}/remove_listing`),
        data: params
    })
        .then(result => result.data)
        .catch(error => {
            const message = error?.response?.data?.message || error.message;
            console.error(message)
            return {
                status: "error",
                message
            };
        });

    return results;
}

// Remove  From sale openForBods

export const removeNftFromOpenForBids = async (id: string, params = {}) => {
    params = typeof params === "object" && params ? params : {};
    let results = await axios({
        method: 'PUT',
        url: getBaseUrl(`/api/nfts/${id}/remove_bids`),
        data: params
    })
        .then(result => result.data)
        .catch(error => {
            const message = error?.response?.data?.message || error.message;
            console.error(message)
            return {
                status: "error",
                message
            };
        });

    return results;
}


// Remove  From sale openForBods

export const removeNftFromAuction = async (id: string, params = {}) => {
    params = typeof params === "object" && params ? params : {};
    let results = await axios({
        method: 'PUT',
        url: getBaseUrl(`/api/nfts/${id}/remove_auction`),
        data: params
    })
        .then(result => result.data)
        .catch(error => {
            const message = error?.response?.data?.message || error.message;
            console.error(message)
            return {
                status: "error",
                message
            };
        });

    return results;
}


export const offerNft = async (id: string, params: any = {}, method: string = "post") => {
    params = typeof params === "object" && params ? params : {};
    var axiosInstance: any;
    if (method === "get") {
        axiosInstance = axios(getBaseUrl(`/api/nfts/${id}/offers`), params);
    } else {
        const axiosMethod: any = method.trim().toUpperCase() || 'POST';
        axiosInstance = axios({
            method: axiosMethod,
            url: getBaseUrl(`/api/nfts/${id}/offers`),
            data: params
        })
    }
    const results = await axiosInstance.then((result: any) => method === "get" ? result.data.data : result.data)
        .catch((error: any) => {
            const message = error?.response?.data?.message || error.message;
            console.error(message)
            return {
                status: "error",
                message
            };
        });

    if (method.toLocaleLowerCase() === "get") {
        if (typeof params.response === "undefined" || params.response === "multi") {
            const data = await results.offers.map(async (data: any) => {
                return await formatOfferData(data)
            });
            return await Promise.all(data.map(async (i: any) => await i));
        }
        return await formatOfferData(results.offers);
    }
    return results;
}

export const placeABidForNft = async (id: string, params = {}) => {
    params = typeof params === "object" && params ? params : {};
    const result = await axios({
        method: "PUT",
        url: getBaseUrl(`/api/nfts/${id}/place_a_bid`),
        data: params
    })
        .then(result => result.data)
        .catch(error => {
            const message = error?.response?.data?.message || error.message;
            console.error(message)
            return {
                status: "error",
                message
            };
        });
    return result;
}

export const acceptNftOffer = async (id: string, params = {}) => {
    params = typeof params === "object" && params ? params : {};
    let results = await axios({
        method: 'PUT',
        url: getBaseUrl(`/api/nfts/${id}/accept_offer`),
        data: params
    })
        .then(result => result.data)
        .catch(error => {
            const message = error?.response?.data?.message || error.message;
            console.error(message)
            return {
                status: "error",
                message
            };
        });

    return results;
}

export const transferNftItem = async (id: string, params = {}) => {
    params = typeof params === "object" && params ? params : {};
    let results = await axios({
        method: 'PUT',
        url: getBaseUrl(`/api/nfts/${id}/transfer`),
        data: params
    })
        .then(result => result.data)
        .catch(error => {
            const message = error?.response?.data?.message || error.message;
            console.error(message)
            return {
                status: "error",
                message
            };
        });

    return results;
}

export const removeFromSale = async (id: string, params = {}) => {
    params = typeof params === "object" && params ? params : {};
    let results = await axios({
        method: 'PUT',
        url: getBaseUrl(`/api/nfts/${id}/remove_from_sale`),
        data: params
    })
        .then(result => result.data)
        .catch(error => {
            const message = error?.response?.data?.message || error.message;
            console.error(message)
            return {
                status: "error",
                message
            };
        });
    return results;
}

// nftViews
export const saveNftViews = async (id: string) => {
    let results = await axios({
        method: 'POST',
        url: getBaseUrl(`/api/nfts/${id}/nftviews`),
    })
        .then(result => result.data)
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

// Get nft Auctions

export const getNftAuctions = async (id: string, params: any = {}) => {
    const response = params.response === "single" ? 'single' : "multi";
    let result = await axios(getBaseUrl(`/api/nfts/${id}/auctions`), { params })
        .then(result => result.data)
        .catch((error: any) => {
            const message = error.response.data.message || error.message;
            console.error(message)
            return {
                status: "error",
                message
            };
        });
        
    if (result.status === "success") {
        if (response === "multi") {
            const data = await result.data.map(async (data: any) => {
                return await formatAuctionData(data)
            });
            return await Promise.all(data.map(async (i: any) => await i));
        }
        return await formatAuctionData(result.data);
    } else {
        return response === "multi" ? [] : {};
    }
}


// Get nft History 

export const getNftHistory = async (id: string, params: any = {}) => {
    const response = params.response === "single" ? 'single' : "multi";
    let result = await axios(getBaseUrl(`/api/nfts/${id}/histories`), { params })
        .then(result => result.data)
        .catch((error: any) => {
            const message = error.response.data.message || error.message;
            console.error(message)
            return {
                status: "error",
                message
            };
        });

    if (result.status === "success") {
        if (response) {
            const data = await result.data.map(async (data: any) => {
                return await formatHistoryData(data)
            });
            return await Promise.all(data.map(async (i: any) => await i));
        }
        return await formatHistoryData(result);
    } else {
        return response ? [] : {};
    }
}


// Get nft Listing 

export const getNftListing = async (id: string, params: any = {}) => {
    const response = params.response === "single" ? 'single' : "multi";
    let result = await axios(getBaseUrl(`/api/nfts/${id}/listing`), { params })
        .then(result => result.data)
        .catch((error: any) => {
            const message = error.response.data.message || error.message;
            console.error(message)
            return {
                status: "error",
                message
            };
        });
    if (result.status === "success") {
        if (response) {
            const data = await result.data.map(async (data: any) => {
                return await formatListingData(data)
            });
            return await Promise.all(data.map(async (i: any) => await i));
        }
        return await formatListingData(result);
    } else {
        return response ? [] : {};
    }
}


const formatOfferData = async (data: any) => {
    if (!data && !Object.keys(data).length) { return false };
    const dollarPrice = await convertEthToDollar(data.offerPrice.toString());
    return {
        ...data,
        offerPrice: {
            eth: parseFloat(data.offerPrice).toFixed(2),
            dollar: dollarPrice.toFixed(2)
        },
        offerer: formatUserData(data.offerer),
        expiration: moment(data.expiredOn).fromNow()
    }
}


const formatListingData = async (data: any) => {
    if (!data && !Object.keys(data).length) { return false };
    const dollarPrice = await convertEthToDollar(data.price.toString());
    return {
        ...data,
        price: {
            eth: parseFloat(data.price).toFixed(2),
            dollar: dollarPrice.toFixed(2)
        },
        creator: formatUserData(data.creator),
        expiration: moment(data.endDate).fromNow()
    }
}


const formatHistoryData = async (data: any) => {
    if (!data && !Object.keys(data).length) { return false };
    const dollarPrice = await convertEthToDollar(data.price.toString());
    return {
        ...data,
        price: {
            eth: parseFloat(data.price > 0 ? data.price : "0").toFixed(2),
            dollar: dollarPrice.toFixed(2)
        },
        owner: formatUserData(data.owner),
        creator: formatUserData(data.creator)
    }
}

const formatAuctionData = async (data: any) => {
    if (!data && !Object.keys(data).length) { return false };
    const maxEthBid = customParseFloat(data.maxBidPrice, 4);
    const minEthBid = customParseFloat(data.minBidPrice, 4);
    const initialEthBid = customParseFloat(data.initialBidPrice, 4);
    const maxDollarBid = await convertEthToDollar(maxEthBid.toString());
    const minDollarBid = await convertEthToDollar(minEthBid.toString());
    const initialDollarBid = await convertEthToDollar(initialEthBid.toString());

    let auctionHistories = data?.auctionHistories?.length ? data.auctionHistories : [];
    let result = await auctionHistories.map(async (history: any) => {
        return await formatAuctionHistoryData(history)
    });
    auctionHistories = await Promise.all(result.map(async (i: any) => await i));

    return {
        ...data,
        auctionHistories: auctionHistories,
        maxBidPrice: {
            eth: maxEthBid,
            dollar: customParseFloat(maxDollarBid)
        },
        minBidPrice: {
            eth: minEthBid,
            dollar: minDollarBid.toFixed(2)
        },
        initialBidPrice: {
            eth: initialEthBid,
            dollar: customParseFloat(initialDollarBid)
        },
        winner: data.winner.length ? formatUserData(data.winner.shift()) : {}
    }
}

const formatAuctionHistoryData = async (data: any) => {
    if (!data && !Object.keys(data).length) { return false };
    const maxEthBid = customParseFloat(data.maxBidPrice, 4);
    const minEthBid = customParseFloat(data.minBidPrice, 4);
    const initialEthBid = customParseFloat(data.initialBidPrice, 4);
    const maxDollarBid = await convertEthToDollar(maxEthBid.toString());
    const minDollarBid = await convertEthToDollar(minEthBid.toString());
    const initialDollarBid = await convertEthToDollar(initialEthBid.toString());

    const id = data.id || data._id;
    delete data._id;
    return {
        ...data,
        id: id,
        maxBidPrice: {
            eth: maxEthBid,
            dollar: customParseFloat(maxDollarBid)
        },
        minBidPrice: {
            eth: minEthBid,
            dollar: customParseFloat(minDollarBid)
        },
        initialBidPrice: {
            eth: initialEthBid,
            dollar: customParseFloat(initialDollarBid)
        },
        owner: formatUserData(data.owner),
        createdBy: formatUserData(data.createdBy)
    }
}

const customParseFloat = (value: string | number, limit: number = 2) => {
    if(typeof value !== "string" && typeof value !== 'number') return 0;
    const newValue: string = typeof value === "number" ? (value > 0 ? value.toString() : '0') : value.trim() > "0" ? value.trim() : '0';
    return parseFloat(parseFloat(newValue).toFixed(limit));
}