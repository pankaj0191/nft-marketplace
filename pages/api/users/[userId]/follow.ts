import { NextApiRequest, NextApiResponse } from "next";
import { Follower } from "backend/models";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "POST") {
            const { userId }: any = req.query;
            const userFollow = new Follower(req, res);
            const result = await userFollow.followedByUser(userId);
            res.status(200).json({
                status: 'success',
                message: "Followed successfully!",
                data: {
                    id: result._id
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