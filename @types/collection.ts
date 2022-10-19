
import { ObjectId } from "mongodb";
import type { UserWalletAddress, IPFSImageProps } from "./wallet";

export interface CollectionInputFields {
    name: string;
    description: string;
    symbol: string;
    socialLinks?: {
        instagram?: string,
        facebook?: string,
        twitter?: string,
        discord?: string,
        website?: string,
    }
    contractAddress: UserWalletAddress;
    transactions: any;
    approvalTransaction: any;
    banner: string | undefined;
    image: string | undefined;
    feature: string | undefined;    
    category: ObjectId,
    genre: ObjectId,
    slug: string,
    blockchain: string,
    collaborators?: string[];
    creatorEarning?: string;
    creatorEarningAddress?: string;
    explicitSensitiveContent: Boolean;
    status: Boolean;
    isVarified: Boolean;
    createdBy: ObjectId;
    updatedBy: ObjectId;
}

export interface CollectionInputUpdateFields {
    name?: string;
    description?: string;
    socialLinks?: {
        instagram?: string,
        facebook?: string,
        twitter?: string,
        discord?: string,
        website?: string,
    }
    banner?: string | undefined;
    image?: string | undefined;
    feature?: string | undefined;    
    category?: ObjectId,
    genre?: ObjectId,
    collaborators?: string[];
    creatorEarning?: string;
    creatorEarningAddress?: string;
    explicitSensitiveContent?: Boolean;
    updatedBy: ObjectId;
}

export interface CollectionDataProps {
    _id?: string;
    id?: string;
    name: string;
    description: string;
    symbol: string;
    socialLinks: {
        instagram?: string,
        facebook?: string,
        twitter?: string,
        discord?: string,
        website?: string,
    }
    contractAddress: UserWalletAddress;
    transactions: any;
    banner: string;
    image: string;
    feature: string;    
    category: any;
    genre: any;
    slug: string,
    blockchain: string,
    collaborators?: string[];
    creatorEarning?: string;
    creatorEarningAddress?: string;
    explicitSensitiveContent: Boolean;
    creator?: any;
    nfts?: Array<{
        count?: number
    }>;
    nftCount?: number;
    status: Boolean;
    isVarified: Boolean;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
}