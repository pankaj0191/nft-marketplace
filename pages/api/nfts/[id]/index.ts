import type { NextApiRequest, NextApiResponse } from 'next'
import { ObjectId } from 'mongodb';

import { Nft } from 'backend/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const nftId: string | string[] = req.query.id || "";
        var ids: any = ""
        if (typeof nftId === "string") {
            ids = new ObjectId(nftId);
        } else {
            ids = nftId.map((id: string) => {
                return new ObjectId(id);
            })
        }
        const NftModel = new Nft(req, res);
        const nft = await NftModel.getById(ids);
        res.status(200).json({
            status: 'success',
            data: nft
        });

    } catch (error: any) {
        res.status(500).json({
            status: "error",
            message: error.message || "something went wrong."
        });
    }
}

