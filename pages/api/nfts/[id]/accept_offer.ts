import { NextApiRequest, NextApiResponse } from "next";
import { Nft } from "backend/models";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "PUT") {
            const { id }: any = req.query;
            const nftLike = new Nft(req, res);
            const inputData = {
                transaction: req.body.transaction,
                offerId: req.body.offerId,
                offerer: req.body.offerer
            };
            const result = await nftLike.acceptOffer(id, inputData);
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