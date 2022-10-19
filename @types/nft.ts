import { ObjectId } from "mongodb";
import { IPFSImageProps, UserWalletAddress } from "./wallet";

export interface NftInputFields {
    title: string;
    description: string;
    tokenId?: string;
    itemId?: string;
    image: string;
    metadata: string;
    extrenalLink?: string;
    collection: ObjectId;
    properties: string[];
    price?: string;
    fileType: string;
    transactions: any;
    approveTokenTransaction: any;
    explicitSensitiveContent: Boolean;
    category: ObjectId;
    genre: ObjectId;
    ownedBy: ObjectId | string;
    onSaleToken: string;
    onMarketPlace?: Boolean;
    marketplace?: {
        type?: string;
        price?: string;
        minBid?: string;
        startDate?: string | Date;
        endDate?: string | Date; 
    };
    status: "draft" | "publish" | "on_sale" | "on_auction";
}

export interface NftDataProps {
    _id: string;
    title: string;
    description: string;
    tokenId?: number;
    itemId?: number;
    image: IPFSImageProps | undefined;
    symbol: string;
    extrenalLink?: string;
    collectionId: string;
    properties?: string[];
    price: number;
    marketplaceTransaction: any;
    tokenTransaction: any;
    metaData?: string;
    explicitSensitiveContent: Boolean;
    category: ObjectId,
    genre: ObjectId,
    onMarketPlace: Boolean;
    marketPlaceAuction: string;
    marketPlaceAuctionData: any;
    isSold: Boolean;
    onSaleToken: string;
    status: Boolean;
    createdBy: string;
    ownedBy: string;
    createdAt: Date;
    updatedAt: Date;
    likeCount: Number;
    viewCount: Number;
}

export interface optionPropsNft {
    skip?: number;
    match?: any;
    limit?: number;
    sortBy?: string | string[];
    sort?: string | string[] | -1;
    creator?: Boolean;
    owner?: Boolean;
    like?: Boolean;
    view?: Boolean;
    trending?: Boolean;
    others?: Array<{}>;
}