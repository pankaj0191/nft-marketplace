import { NextApiRequest, NextApiResponse } from "next";
import { NftHistory } from "backend/models";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "GET") {
            const { id }: any = req.query;
            const historyModel = new NftHistory(req, res);
            const result = await historyModel.getAll(id);
            res.status(200).json({
                status: 'success',
                data: result
            })
        }
    } catch (error: any) {
        res.status(500).json({
            status: "error",
            message: error.message || "something went wrong."
        });
    }
}

