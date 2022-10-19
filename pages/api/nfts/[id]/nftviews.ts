import { NextApiRequest, NextApiResponse } from "next";
import { NftViews } from "backend/models";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "POST") {
            const { id }: any = req.query;
            const nftLike = new NftViews(req, res);
            const result = await nftLike.nftViewsByUser(id);
            res.status(200).json({
                status: 'success',
                data: {
                    id: result._id
                }
            })

        } else if (req.method === "GET") {
            res.status(200).json({
                status: 'success',
                data: {

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