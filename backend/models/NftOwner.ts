import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'

import Model from "./Model";

export class NftOwner extends Model {

    collection: string = "nft_owners";

    constructor(req: NextApiRequest, res: NextApiResponse) {
        super("nft_owners", req, res);
    }

    getNftOffer = async (nftId: string = "", options = {}) => {
        options = typeof options === 'object' && options ? options : {};
        await this.aggregate([
            {
                $match: {
                    $and: [
                        { $expr: { $eq: ["$createdBy", new ObjectId(this.user.id)] } },
                        { $expr: { $eq: ["$nftId", new ObjectId(nftId)] } }
                    ]
                }
            }
        ], 'single');
        return await this.get({ nftId: new ObjectId(nftId) })
    }

    saveData = async (inputData: any) => {
        return await this.insert({
            ...inputData,
            saleOn: new Date()
        }, {
            restricted: false
        });
    }

}