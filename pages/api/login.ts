// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Config, uniqueUsernameGenerator } from 'unique-username-generator';
import { setCookies } from 'cookies-next'

import { JWT } from 'utils/jwt';
import { UserInputFields, UserWalletAddress } from '@types';
import { getColors } from 'helpers';
import { User } from 'backend/models';
import { isValidUserWalletAddress, SECRET } from 'utils';


interface requestBodyProps {
    address: UserWalletAddress
}

const dictionary = [
    "Iron Man", "Captain America", "Hulk", "Thor", "Ant-Man", "Wasp", "Doctor Strange",
    "Black Widow", "Black Panther", "Shuri", "Okoye", "Wintor Soldier", "Howkeye",
    "Falcon", "Maria Hill", "Vision", "Hulkbuster", "War Machine", "Nick Fury"
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "POST") {
            const { address = "" }: requestBodyProps = req.body || {};
            if (isValidUserWalletAddress(address)) {
                const user = await checkLoginUser(address, req, res);
                const jwt = new JWT();
                var token = jwt.createToken(user);
                setCookies(SECRET, token, { req, res, maxAge: 60 * 60 * 3 });
                res.status(200).json({
                    status: "success",
                    data: { token }
                })
            } else {
                res
                    .status(403)
                    .json({
                        status: "error",
                        message: "Invalid user address"
                    });
            }
        } else {
            res
                .status(403)
                .json({
                    status: "error",
                    message: "Invalid method"
                });
        }
    } catch (error: any) {
        res
            .status(500)
            .json({
                status: "error",
                message: error.message || "something went wrong."
            });
    }
}

const checkLoginUser = async (userAddress: UserWalletAddress, req: NextApiRequest, res: NextApiResponse) => {
    const { accounts, authData } = req.body;
    const UserModel = new User(req, res);
    var checkUser = await UserModel.first(userAddress, {}, "ethAddress");
    if (!checkUser) {
        const random = Math.floor(Math.random() * dictionary.length);
        const name = dictionary[random] || "noname";
        const config: Config = {
            dictionaries: [
                name.split(" ")
            ],
            separator: '',
            style: 'lowerCase',
            randomDigits: 3,
            length: 25
        }
        const username: string = uniqueUsernameGenerator(config);
        const inputData: UserInputFields = {
            name: name,
            ethAddress: userAddress,
            username: username,
            description: "",
            colors: getColors(4),
            accounts: accounts,
            socialLinks: {},
            isVarified: false,
            theme: "light",
            banner: undefined,
            image: undefined,
            authData: authData || {},
            status: false,
        };
        const result = await UserModel.insert(inputData);
        checkUser = await UserModel.first(result._id);
    } else {
        const customEth: any = checkUser.authData.customEth || {};
        if (customEth.signer !== authData.customEth.signer) {
            throw new Error("Invalid user signer!");
        }
        if(typeof customEth.network === "undefined") {
            await UserModel.update(checkUser.id.toString(), {
                authData: authData
            });
            checkUser = await UserModel.first(checkUser.id.toString());
        }
    }
    return checkUser;
}