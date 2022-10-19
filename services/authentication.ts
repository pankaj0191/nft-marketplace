import { UserWalletAddress } from "@types";
import axios from "axios";

import { getBaseUrl } from "../helpers/axios";
import { JWT } from '../utils/jwt'

interface OptionPops {
    address: UserWalletAddress;
    authData: {
        customEth: {
            id: UserWalletAddress;
            signer: string;
            message: string;
            network: {
                chainId: number;
                ensAddress: string;
                name: string;
            }
        }
    };
    accounts: string[],
}

export const authenticate = async (options: OptionPops) => {
    let result = await axios({
        method: "POST",
        url: getBaseUrl("/api/login"),
        data: options
    })
        .then(result => result.data)
        .catch(error => {
            console.error(error.response.data.message || error.message)
            return [];
        });

    return getTokenData(result?.data?.token || "");

}

export const getTokenData = (token: string) => {
    if (token) {
        const jwt = new JWT();
        const data = jwt.varifyToken(token);
        return {
            token,
            user: data
        }
    }
    return false;

}

export const signOut = async () => {
    let result = await axios.get(getBaseUrl("/api/logout"))
        .then(result => result.data)
        .catch(error => {
            console.log(error)
            return [];
        });
    return result;
}