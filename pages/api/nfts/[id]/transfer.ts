import { NextApiRequest, NextApiResponse } from "next";
import { Nft } from "backend/models";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "PUT") {
            const { id }: any = req.query;
            const nftModel = new Nft(req, res);          
            const result = await nftModel.transferNftItem(id, { 
                transaction: req.body.transaction
            });
            res.status(200).json({
                status: 'success',
                message: "successfully buy nft!",
                data: {}
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