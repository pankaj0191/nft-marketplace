import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'

import Model from "./Model";
import { Nft } from './Nft';

export class NftHistory extends Model {

    collection: string = "nft_histories";

    constructor (req: NextApiRequest, res: NextApiResponse) {
        super("nft_histories", req, res);
    }

    getNftHistory = async (nftId: string = "", options = {}) => {
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

    async getAll (nftId: string, options: any = {}) {
        const nftModel = new Nft(this.request, this.response);
        const nftData = await nftModel.first(nftId);
        if(!nftData) throw new Error("Invalid nft id");
        const andOptions: any = [
            { nftId: new ObjectId(nftId) }
        ];
        const responseType = options?.response?.trim() == "single" ? 'single' : "multi";
        
        return this.aggregate([
            {
                $match: { $and: andOptions }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "creator",
                    foreignField: "_id",
                    as: "creator",
                }
            },
            { $unwind: "$owner" },
            { $unwind: "$creator" },
        ], responseType)
    }
    
}