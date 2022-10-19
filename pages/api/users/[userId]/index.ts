import type { NextApiRequest, NextApiResponse } from 'next'

import { User as UserModel } from 'backend/models'
import type { UserInputUpdateFields } from '@types';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const userId: any = req.query.userId || "";
        const User = new UserModel(req, res);
        if (req.method === "PUT") {
            const validatedData = await validateFormData(req, res, userId);
            await User.update(userId, validatedData);
            res.status(200).json({
                status: 'success',
                message: "Updated successfully",
            })
        } else if (req.method === "GET") {
            const user = await User.getDetails(new ObjectId(userId));
            res.status(200).json({
                status: 'success',
                message: "",
                data: user,
            })
        } else {
            throw new Error("Invalid method");
        }
    } catch (error: any) {
        res.status(500).json({
            status: "error",
            message: error.message || "something went wrong."
        });
    }
}

const validateFormData = async (req: NextApiRequest, res: NextApiResponse, userId: string | string[]) => {
    if (typeof req.body === "object") {
        const User = new UserModel(req, res);
        const user = await User.first(userId);
        if (user) {
            const formData = req.body;
            const checkUsername = await User.first(formData.username, {}, "username");
            if (checkUsername && checkUsername.id.toString() !== user.id.toString()) {
                throw new Error("This username is already exist!");
            }
            const inputData: UserInputUpdateFields | any = {};
            const defaultData = {
                name: "string",
                username: "string",
                description: "string",
                accounts: "UserWalletAddress[]",
                socialLinks: {
                    facebook: "string",
                    instagram: "string",
                    twitter: "string",
                    discord: "string",
                },
                theme: "string",
                banner: "string|undefined",
                image: "string|undefined",
                authData: "any",
                status: "Boolean",
            }
            Object
                .keys(defaultData)
                .forEach(k => {
                    if (typeof formData[k] !== "undefined") {
                        inputData[k] = formData[k];
                    }
                });
            return inputData;
        } else {
            throw new Error("Invalid user ID");
        }
    } else {
        throw new Error("Invalid form data");
    }

}