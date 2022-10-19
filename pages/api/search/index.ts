import { NextApiRequest, NextApiResponse } from "next";
import { Nft, User, Collection } from "backend/models";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { keyword } = req.query;
    const options:any = getOptions(req)
    const nameOptions = {
        ...options,
        match: {
            ...options.match,
            name : { $regex: keyword, $options: "i" }
        }
    }
    const titleOptions = {
        ...options,
        match: {
            ...options.match,
            title : { $regex: keyword, $options: "i" }
        }
    }
    const NftModel = new Nft(req, res);
    const CollectionModel = new Collection(req, res);
    const UserModel = new User(req, res);
    const collections = await CollectionModel.getAll(nameOptions)
    const nfts = await NftModel.getAll(titleOptions);
    const users = await UserModel.getAll(nameOptions)

    res.status(200).json({
        status: 'success',
        message: "",
        data: {
            collections: collections || [],
            nfts: nfts || [],
            users: users || [],
        }
    })
}


const getOptions = (req: NextApiRequest) => {
    const {
        limit = 0,
        skip = 0,
        sortBy = "updatedAt",
        sort = -1,
    } = req.query;

    const options:any = {
        limit: parseInt(limit.toString()),
        skip: parseInt(skip.toString()),
        sortBy,
        sort,
        match: {},
        search: true
    };
    return options;
}