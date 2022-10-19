import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'

import Model from "./Model";
import { Nft } from './Nft';

export class NftLike extends Model {

    collection: string = "nft_likes";

    constructor(req: NextApiRequest, res: NextApiResponse) {
        super("nft_likes", req, res);
    }


    likedByUser = async (nftId: string) => {
        const NftModel = new Nft(this.request, this.response);
        const nft = await NftModel.first(nftId)
        if (!nft) throw new Error("Invalid nft id!");
        
        const isLiked = await this.aggregate([
            {
                $match: {
                    $and: [
                        { $expr: { $eq: ["$createdBy", new ObjectId(this.user.id)] } },
                        { $expr: { $eq: ["$nftId", new ObjectId(nftId)] } }
                    ]
                }
            }
        ], 'single');
        if (isLiked) throw new Error("Already liked this nft!");
        return await this.insert({ nftId: new ObjectId(nftId) })
    }

    // Unliked
    unlikedByUser = async (nftId: string) => {        
        await this.connectDb();
        return await this.db.deleteOne({
            nftId: new ObjectId(nftId),
            createdBy: new ObjectId(this.user.id)
        });
    }

}