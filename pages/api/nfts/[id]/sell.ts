import { NextApiRequest, NextApiResponse } from "next";
import { Nft, NFTItemOnSaleData } from "backend/models";
import moment from "moment";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "PUT") {
            const { id }: any = req.query;
            const nftModel = new Nft(req, res);
            const inputData: NFTItemOnSaleData = await validateData(req, res, id);
            const result = await nftModel.nftItemOnSale(id, inputData);
            if (result) {
                res.status(200).json({
                    status: 'success',
                    message: "Item set on sale successfully!",
                    data: {
                        id: id,
                    }
                })
            } else {
                throw new Error("Something went wrong!");
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

const validateData = async (req: NextApiRequest, res: NextApiResponse, _id: string) => {
    if (typeof req.body === "object") {
        const nftModel = new Nft(req, res);
        const nftData = await nftModel.first(_id);
        if (nftData) {
            const formData = req.body;
            const data = formData.marketplace.data || {};
            const listingType = data.type?.trim() || "";
            var message: string = "";
            if (!listingType.trim()) {
                message = "Invalid listing type";
            }
            if (listingType === "fixed_price") {
                if (parseFloat(data.price) <= 0) {
                    message = "Invalid listing price for nft item";
                }
            } else if (listingType === "timed_auction") {
                if (parseFloat(data.minBid || "0") <= 0) {
                    message = "Minimum bid must be required!"
                } else if (!data.startDate) {
                    message = "Start date must be required!"
                } else if (!data.endDate) {
                    message = "End date must be required!"
                } else if (!moment(data.endDate).isAfter(data.startDate)) {
                    message = "End date must be greater than start date!"
                }
            }
            if (message) throw new Error(message);
            const inputData: any = {
                transactions: {
                    [listingType]: formData.transactions,
                },
                onMarketPlace: true,
                token: formData.marketplace.token || "",
                marketplace: formData.marketplace.data || {},
                status: listingType === "timed_auction" ? "on_auction" : "on_sale",
            }
            if (listingType === "fixed_price") {
                inputData.price = data.price;
            }
            return inputData;
        } else {
            throw new Error("Invalid nft id");
        }
    } else {
        throw new Error("Invalid form data");
    }
}