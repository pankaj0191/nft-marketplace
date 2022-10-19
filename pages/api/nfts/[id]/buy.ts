import { NextApiRequest, NextApiResponse } from "next";
import { Nft } from "backend/models";
import { validateBuyData } from "backend/schema";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "PUT") {
            const { id }: any = req.query;
            const nftModel = new Nft(req, res);
            const validateResult = await validateBuyData({
                listId: req.body.listId,
                transaction: req.body.transaction
            });
            if(validateResult.status) {
                await nftModel.buyNftItem(id, validateResult.data);
                res.status(200).json({
                    status: 'success',
                    message: "successfully buy nft!",
                    data: {}
                });
            } else {
                throw new Error(validateResult.errors.shift());
            }

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