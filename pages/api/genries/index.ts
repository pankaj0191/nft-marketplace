import type { NextApiRequest, NextApiResponse } from 'next'

import { Genre as GenreModel } from 'backend/models'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const Genre = new GenreModel(req, res);
        if (req.method === "GET") {
            const genries = await Genre.get();
            res.status(200).json({
                status: 'success',
                message: "",
                data: {
                    genries
                }
            })
        } else {
            res
                .status(403)
                .json({
                    status: "error",
                    msg: "Invalid method",
                });
        }
    } catch (error: any) {
        res
            .status(500)
            .json({
                status: "error",
                message: error.message || "something went wrong."
            });
    }
}