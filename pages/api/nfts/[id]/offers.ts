import { NextApiRequest, NextApiResponse } from "next";

import { Nft, NftOffer } from "backend/models"; 
import { validateMakeAOffer } from "backend/schema";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id }: any = req.query;
        if (req.method === "POST") {
            const nftModel = new Nft(req, res);
            const validateResult = await validateMakeAOffer({
                transaction: req.body.transaction,
                price: req.body.price,
                expiredDate: req.body.expiredDate
            });
            if(validateResult.status) {
                await nftModel.makeAOffer(id, validateResult.data);
                res.status(200).json({
                    status: 'success',
                    message: "successfully offered for a nft item!",
                    data: {}
                })
            } else {
                throw new Error(validateResult.errors.shift());
            }

        } else if(req.method === "GET") {
            const NftOfferModel = new NftOffer(req, res);
            const current = req.query?.current || false;
            const options = {
                current: current && current == "true" ? true: false,
                response: req.query?.response === "single" ? 'single': "multi"
            }
            const nftOffers = await NftOfferModel.getAll(id, options);
            res.status(200).json({
                status: 'success',
                message: "",
                data: {
                    offers: nftOffers
                },
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