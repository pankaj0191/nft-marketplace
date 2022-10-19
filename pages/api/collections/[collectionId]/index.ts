import type { NextApiRequest, NextApiResponse } from 'next'

import { Collection as UserCollectionModel } from 'backend/models'
import type { CollectionInputUpdateFields } from '@types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        var collectionId: any = req.query.collectionId || "";
        collectionId = collectionId === "diamond_verse" ? "" : collectionId;
        const Collection = new UserCollectionModel(req, res);
        if (req.method === "PUT") {
            const validatedData = await validateFormData(req, res, collectionId);
            await Collection.update(collectionId, validatedData);
            res.status(200).json({
                status: 'success',
                message: "Updated successfully",
            })
        } else {
            const options = getOptions(req);
            const collection = await Collection.getCollectionById(collectionId, options);
            res.status(200).json({
                status: 'success',
                message: "",
                data: collection
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: "error",
            message: error.message || "something went wrong."
        });
    }
}

const validateFormData = async (req: NextApiRequest, res: NextApiResponse, _id: string | string[]) => {
    if (typeof req.body === "object") {
        const Collection = new UserCollectionModel(req, res);
        const collection = await Collection.first(_id);
        if (collection) {
            const formData = req.body;
            const inputData: CollectionInputUpdateFields | any = {
                updatedBy: "",
            };
            const defaultData = {
                name: "string",
                description: "string",
                socialLinks: {
                    facebook: "string",
                    instagram: "string",
                    twitter: "string",
                    discord: "string",
                },
                banner: "IPFSImageProps|undefined",
                image: "IPFSImageProps|undefined",
                feature: "IPFSImageProps|undefined",
                status: "Boolean",
                isVarified: "Boolean",
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

const getOptions = (req: NextApiRequest) => {
    const { nft = false, creator = false, owner = false, like = false, view = false } = req.query;
    const options = {
        nft,
        creator,
        owner,
        like,
        view
    };
    return options;
}