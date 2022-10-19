import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'
import { EthTransaction } from './EthTransaction';

import Model from "./Model";
import { Nft } from './Nft';

interface InputDataProps {
    transaction: any;
    initialBid: string;
    minBid: string;
    maxBid: string;
    nftId: string;
}

export class NftAuctionHistory extends Model {

    collection: string = "nft_auction_histories";

    constructor(req: NextApiRequest, res: NextApiResponse) {
        super("nft_auction_histories", req, res);
    }

    async saveData(auctionId: string, inputData: InputDataProps) {
        const nftModel = new Nft(this.request, this.response);
        const nftData: any = await nftModel.first(inputData.nftId);
        if (!nftData) throw new Error("Invalid nft id");
        if(!nftData.onMarketPlace) throw new Error('Item is not on sale');
        if (nftData.status?.trim() !== "on_auction") throw new Error("Item is not on auction sale");

        const result = await this.insert({
            auctionId: new ObjectId(auctionId),
            nftId: new ObjectId(inputData.nftId),
            initialBidPrice: inputData.initialBid,
            minBidPrice: inputData.minBid,
            maxBidPrice: inputData.maxBid,
            owner: new ObjectId(nftData.ownedBy)
        });
        if(result._id) {
            const ethTransaction = new EthTransaction(this.request, this.response);
            await ethTransaction.insert({
                ...inputData.transaction,
                type: "nft",
                subType: "place_a_bid",
                moduleId: new ObjectId(inputData.nftId),
                subModuleId: new ObjectId(result._id),
            });
            await nftModel.createHistory(
                inputData.nftId,
                'place_a_bid',
                nftData.ownedBy,
                nftData.createdBy,
                inputData.transaction,
                inputData.maxBid
            );
            return result._id;
        }
        return false;
    }

}