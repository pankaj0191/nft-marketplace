import type { NextApiRequest, NextApiResponse } from 'next'

import { Collection } from 'backend/models';
import { ObjectId } from 'mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const collectionId: string | string[] = req.query.collectionId || "";
    var ids: any = ""
    if (typeof collectionId === "string") {
        ids = new ObjectId(collectionId);
    } else {
        ids = collectionId.map((id: string) => {
            return new ObjectId(id);
        })
    }
    const CollectionModel = new Collection(req, res);
    const options = getOptions(req);
    const collection = await CollectionModel.getOtherDetails(ids, options);
    res.status(200).json({
        status: 'success',
        message: "",
        data: collection,
    })
}

const getOptions = (req: NextApiRequest) => {
    const {
        nft = false,
        owner = false,
        floorPrice = false,
    } = req.query;
    const options = {
        nft,
        owner,
        floorPrice,
    };
    return options;
}