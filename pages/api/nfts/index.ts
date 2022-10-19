import type { NextApiRequest, NextApiResponse } from 'next'
import { EthTransaction, Nft as UserNftModel } from 'backend/models'
import type { NftInputFields, optionPropsNft } from '@types';
import { ObjectId } from 'mongodb';
import { User } from 'utils/api/user';
import moment from 'moment';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const NftModel = new UserNftModel(req, res);
        const LoginUser = new User(req, res);
        const loginUserId = LoginUser.get('id') || "";
        if (req.method === "POST") {
            const inputData = await validateFormData(req, res);
            if (loginUserId) {
                inputData.ownedBy = new ObjectId(loginUserId);
            }
            const result = await NftModel.insert(inputData);
            if (result._id) {
                const ethTransaction = new EthTransaction(req, res);
                await ethTransaction.insert({
                    ...inputData.transactions,
                    type: "nft",
                    subType: "mint",
                    moduleId: new ObjectId(result._id),
                });

                await NftModel.createHistory(
                    result._id.toString(),
                    "mint",
                    loginUserId,
                    loginUserId,
                    inputData.transactions,
                    inputData.price
                );
            }
            res.status(200).json({
                status: 'success',
                message: "Successfully created new NFT.",
                data: result
            })
        } else {
            const options: optionPropsNft = getOptions(req);

            const nfts = await NftModel.getAll(options);
            res.status(200).json({
                status: 'success',
                message: "",
                data: {
                    nfts
                }
            })
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

const getOptions = (req: NextApiRequest) => {
    let {
        limit = 0,
        skip = 0,
        createdBy = "",
        ownedBy = "",
        sort = { "updatedAt": -1 },
        trending = false,
        auction = false,
        collectionId = "",
        status = ["publish", "on_sale", "on_auction"]
    }: any = req.query;

    sort = IsJsonString(sort) ? IsJsonString(sort) : { "updatedAt": -1 };
    const Trending: Boolean = typeof trending === "object" || trending !== "true" ? false : true;
    status = status ? typeof status === "object" ? status : status.trim().split(',') : [];
    const options: optionPropsNft = {
        limit: parseInt(limit.toString()),
        skip: parseInt(skip.toString()),
        sort,
        trending: Trending,
        match: {}
    };
    if (status.length) {
        options.match.status = {
            $in: status
        }
    }

    if (createdBy) { options.match.createdBy = new ObjectId(createdBy) }
    if (ownedBy) { options.match.ownedBy = new ObjectId(ownedBy) }
    if (collectionId) { options.match.collection = new ObjectId(collectionId) }
    if (auction) {
        options.match = {
            ...options.match,
            status: "on_auction",
            "marketplace.endDate": { $gte: moment().format() }
        }
    }
    return options;
}

const validateFormData = async (req: NextApiRequest, res: NextApiResponse) => {
    if (typeof req.body === "object") {
        const user = new User(req, res);
        const formData = req.body;
        const collection = formData.collection;
        let collectionId: any = "";
        if (collection) {
            collectionId = new ObjectId(formData.collection);
        } else {
            const dvCollection = await user.getDVCollection();
            collectionId = dvCollection ? dvCollection.id : "";
        }
        if (!collectionId) {
            throw new Error("Diamond Verse Collection not found!");
        }
        const validateDate: NftInputFields = {
            title: formData.title,
            description: formData.description,
            tokenId: formData.tokenId,
            itemId: formData.itemId,
            transactions: formData.transactions,
            approveTokenTransaction: formData.approveTokenTransaction,
            image: formData.image,
            metadata: formData.metadata,
            extrenalLink: formData.externalLink,
            collection: collectionId,
            properties: formData.properties || [],
            price: formData.price || "",
            fileType: formData.fileType,
            explicitSensitiveContent: formData.explicitSensitiveContent || false,
            category: new ObjectId(formData.category),
            genre: new ObjectId(formData.genre),
            ownedBy: "",
            onSaleToken: "",
            onMarketPlace: false,
            marketplace: {},
            status: 'publish',
        };
        return validateDate;
    } else {
        throw new Error("Invalid form data");

    }

}


const IsJsonString = (str: string | any) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return false;
    }
}











