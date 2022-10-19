import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'
import Model from "./Model";
import { Nft } from './Nft';

export class NftViews extends Model {

    collection: string = "nft_views";

    constructor(req: NextApiRequest, res: NextApiResponse) {
        super("nft_views", req, res);
    }


    nftViewsByUser = async (nftId: string) => {
        const NftModel = new Nft(this.request, this.response);
        const nft = await NftModel.first(nftId)
        if (!nft) throw new Error("Invalid nft id!");

        const id = new ObjectId(nftId);
        // const isViewed = await this.aggregate([
        //     {
        //         $match: {
        //             $and: [
        //                 { $expr: { $eq: ["$createdBy", new ObjectId(this.user.id)] } },
        //                 { $expr: { $eq: ["$nftId", id] } }
        //             ]
        //         }
        //     }
        // ], 'single');
        // if (isViewed) throw new Error("Already view this nft!");
        return await this.insert({ nftId: id })
    }
}