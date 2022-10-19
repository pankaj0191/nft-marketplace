import { NextApiRequest, NextApiResponse } from "next";
import { NftAuction } from "backend/models";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "GET") {
            const { id }: any = req.query;
            const auctionModel = new NftAuction(req, res);
            const response: any = req.query.response || "multi";
            const current: any = req.query.response || false;
            const result = await auctionModel.getAll(id, {
                response: response,
                current: current === "false" || !current ? false : true
            });
            res.status(200).json({
                status: 'success',
                data: result
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: "error",
            message: error.message || "something went wrong."
        });
    }
}

