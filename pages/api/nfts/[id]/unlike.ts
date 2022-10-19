import { NextApiRequest, NextApiResponse } from "next";
import { NftLike } from "backend/models";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "DELETE") {
            const { id }: any = req.query;
            const nftLike = new NftLike(req, res);
            const result = await nftLike.unlikedByUser(id);
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
        }else {
            throw new Error("Invalid method");
        }
    } catch (error: any) {
        res.status(500).json({
            status: "error",
            message: error.message || "something went wrong."
        });
    }
}