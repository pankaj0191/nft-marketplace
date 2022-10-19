import type { NextApiRequest, NextApiResponse } from 'next'

import { Category as CategoryModel } from 'backend/models'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const Category = new CategoryModel(req, res);
        if (req.method === "GET") {
            const categories = await Category.get();
            res.status(200).json({
                status: 'success',
                message: "",
                data: {
                    categories
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