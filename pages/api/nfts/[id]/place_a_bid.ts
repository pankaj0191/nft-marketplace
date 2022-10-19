import { NextApiRequest, NextApiResponse } from "next";
import { Nft, NftAuction } from "backend/models";
import { validatePlaceABidData } from "backend/schema";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id }: any = req.query;
        if (req.method === "PUT") {
            const nftModel = new Nft(req, res);
            const validateResult = await validatePlaceABidData({
                transaction: req.body.transaction,
                price: req.body.price
            });
            if(validateResult.status) {
                const auctionId = await nftModel.placeABid(id, validateResult.data);
                res.status(200).json({
                    status: 'success',
                    message: "successfully buy nft!",
                    data: {
                        auctionId
                    }
                })
            } else {
                throw new Error(validateResult.errors.shift());
            }
        } else if(req.method === "GET") {
            const NftAuctionModel = new NftAuction(req, res);
            const current = req.query?.current || false;
            const options = {
                current: current && current == "true" ? true: false,
                response: req.query?.response === "single" ? 'single': "multi"
            }
            const nftAuctions = await NftAuctionModel.getAll(id, options);
            res.status(200).json({
                status: 'success',
                message: "",
                data: {
                    auctions: nftAuctions
                }
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