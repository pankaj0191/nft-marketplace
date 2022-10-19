
import type { UserWalletAddress, IPFSImageProps } from "./wallet";

export interface UserInputFields {
    name: string;
    ethAddress: UserWalletAddress;
    username: string;
    description: string;
    colors: string[];
    accounts: UserWalletAddress[];
    socialLinks?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        discord?: string;
    }
    isVarified: Boolean;
    theme: string;
    banner: IPFSImageProps | undefined;
    image: IPFSImageProps | undefined;
    authData?: any;
    status: Boolean;
}

export interface UserInputUpdateFields {
    name?: string;
    username?: string;
    description?: string;
    accounts?: UserWalletAddress[];
    socialLinks?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        discord?: string;
    }
    theme?: string;
    banner?: IPFSImageProps | undefined;
    image?: IPFSImageProps | undefined;
    authData?: any;
    status?: Boolean;
}

interface CountProps {
    count?: number;
}

export interface UserDataProps {
    _id?: string;
    id?: string;
    name: string;
    ethAddress: UserWalletAddress;
    address?: UserWalletAddress;
    username: string;
    description: string
    socialLinks: {
        instagram?: string,
        facebook?: string,
        twitter?: string,
        discord?: string,
        website?: string,
    };
    banner: IPFSImageProps | string;
    image: IPFSImageProps | string;
    colors: string;
    isVarified: Boolean;
    ownedNft?: CountProps[] | undefined;
    createdNft?: CountProps[] | undefined;
    collections?: CountProps[] | undefined
    followers?: CountProps[] | undefined
    followings?: CountProps[] | undefined
    createdAt: Date;
    updatedAt: Date;
}


export interface optionProps {
    skip?: number;
    match?: any;
    ownedNft?: Boolean;
    createdNft?: Boolean;
    limit?: number;
    sortBy?: string | string[];
    sort?: string | string[] | -1;
    collection?: Boolean;
    follower?: Boolean;
    following?: Boolean;
    others?: Array<{}>;
}