import moment from 'moment';
import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'
import { format } from 'path';
import { EthTransaction } from './EthTransaction';

import Model from "./Model";
import { Nft } from './Nft';

interface InputDataProps {
    transaction: any;
    price: string;
    secret: string;
}

export class NftListing extends Model {

    collection: string = "nft_listing";

    constructor (req: NextApiRequest, res: NextApiResponse) {
        super("nft_listing", req, res);
    }

    async saveData(nftId: string, inputData: InputDataProps) {
        const nftModel = new Nft(this.request, this.response);
        const nftData: any = await nftModel.first(nftId);
        if (!nftData) throw new Error("Invalid nft id");
        if(!nftData.onMarketPlace || nftData.status?.trim() !== "on_sale") throw new Error('Item is not on sale');
        if (parseFloat(inputData.price) <= 0) throw new Error("Price must be greater than zero");
        
        const result = await this.insert({
            nftId: new ObjectId(nftId),
            startDate: new Date(),
            endDate: new Date(moment().add(1, "month").format('YYYY-MM-DD 23:59:00')),
            price: inputData.price,
            secret: inputData.secret,
            status: 'created'
        });
        if (result?._id) {
            const ethTransaction = new EthTransaction(this.request, this.response);
            await ethTransaction.insert({
                ...inputData.transaction,
                type: "nft",
                subType: "listed",
                moduleId: new ObjectId(nftId),
                subModuleId: new ObjectId(result._id),
            });
            await nftModel.createHistory(
                nftId,
                'listed',
                nftData.ownedBy,
                nftData.createdBy,
                inputData.transaction,
                inputData.price
            );
            return result._id;
        } else {
            throw new Error("Something went wrong");
        }
    }

    async getAll (nftId: string, options: any) {
        const nftModel = new Nft(this.request, this.response);
        const nftData = await nftModel.first(nftId);
        if(!nftData) throw new Error("Invalid nft id");
        const andOptions: any = [
            { nftId: new ObjectId(nftId) }
        ];
        if(options?.current) {
            andOptions.push({ secret: nftData.onSaleToken });
        }
        const responseType = options?.response?.trim() == "single" ? 'single' : "multi";
        
        return this.aggregate([
            {
                $match: { $and: andOptions }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "creator",
                }
            },
            { $unwind: "$creator" },
        ], responseType)
    }
}