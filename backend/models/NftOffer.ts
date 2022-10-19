import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'

import Model from "./Model";
import { Nft, MakeAOfferProps, AcceptOfferProps } from './Nft';
import { EthTransaction } from './EthTransaction';
import moment from 'moment';
import { User } from './User';
import { NftOwner } from './NftOwner';

interface GetAllOptions {
    current?: Boolean;
    response?: string;
}

export class NftOffer extends Model {

    collection: string = "nft_offers";

    constructor(req: NextApiRequest, res: NextApiResponse) {
        super("nft_offers", req, res);
    }

    async saveData(nftId: string, inputData: MakeAOfferProps) {
        try {
            const nftModel = new Nft(this.request, this.response);
            const nftData: any = await nftModel.first(nftId);
            if (!nftData) throw new Error("Invalid nft id");
            if(!nftData.onMarketPlace || nftData.status?.trim() !== "on_sale") throw new Error('Item is not on sale');
            if (parseFloat(inputData.price) <= 0) throw new Error("Offer price must be greater than zero");

            const result = await this.insert({
                nftId: new ObjectId(nftId),
                secret: nftData.onSaleToken,
                owner: new ObjectId(nftData.ownedBy),
                expiredOn: inputData.expiredDate,
                offerPrice: inputData.price,
            });
            if (result?._id) {
                const ethTransaction = new EthTransaction(this.request, this.response);
                await ethTransaction.insert({
                    ...inputData.transaction,
                    type: "nft",
                    subType: "make_a_offer",
                    moduleId: new ObjectId(nftId),
                    subModuleId: new ObjectId(result._id),
                });
                await nftModel.createHistory(
                    nftId,
                    'make_a_offer',
                    nftData.ownedBy,
                    nftData.createdBy,
                    inputData.transaction,
                    inputData.price
                );
                return result._id;
            } else {
                throw new Error("Something went wrong");
            }
        } catch (error: any) {
            throw new Error(error.message || "Something went wrong");
        }
    }

    async acceptOffer (nftId: string, inputData: AcceptOfferProps) {
        try {
            const nftModel = new Nft(this.request, this.response);
            const nftData: any = await nftModel.first(nftId);
            if(nftData) {
                const userModel = new User(this.request, this.response);
                const offerer = await userModel.first(inputData.offerer, {}, "ethAddress");
                if(!offerer) throw new Error('Invalid offerer!');
                if(!nftData.onMarketPlace || nftData.status?.trim() !== "on_sale") throw new Error('Item is not on sale');
                const offerData = await this.aggregate([
                    {
                        $match: { 
                            $and : [
                                { nftId: new ObjectId(nftId) },
                                { secret: nftData.onSaleToken },
                                { createdBy: new ObjectId(offerer.id) }
                            ]
                         }
                    }
                ], 'single');

                if(!offerData) throw new Error('Invalid offer!');
                if(moment().isAfter(offerData.createdAt) && moment(offerData.expiredOn).isAfter(moment())){
                    const result = await nftModel.update(nftId, {
                        marketplace: {},
                        onMarketPlace: false,
                        onSaleToken: "",
                        status: 'publish',
                        price: offerData.offerPrice,
                        ownedBy: new ObjectId(offerer.id)
                    });
                    if (result) {
                        // Save owner history of the item
                        const NftOwnerModel = new NftOwner(this.request, this.response);
                        await NftOwnerModel.saveData({
                            nftId: new ObjectId(nftId),
                            seller: new ObjectId(nftData.createdBy),
                            price: offerData.offerPrice
                        });
                        const ethTransaction = new EthTransaction(this.request, this.response);
                        await ethTransaction.insert({
                            ...inputData.transaction,
                            type: "nft",
                            subType: "accepted_offer",
                            moduleId: new ObjectId(nftId),
                            subModuleId: new ObjectId(offerer.id),
                        }, {
                            restricted: false
                        });
                        await nftModel.createHistory(
                            nftId,
                            'accepted_offer',
                            offerer.id,
                            nftData.createdBy,
                            inputData.transaction,
                            offerData.offerPrice
                        );
                        return result;
                    } else {
                        throw new Error("Something went wrong");
                    }
                } else {
                    throw new Error('Offer expired for the item!');
                }
                
            } else {
                throw new Error("Invalid nft id");
            }
        } catch (error: any) {
            throw new Error(error.message || "Something went wrong");
        }
    }

    async getAll (nftId: string, options: GetAllOptions = {}) {
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
                $match: { $and: andOptions },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "offerer",
                }
            },
            { $unwind: "$offerer" },
        ], responseType)
    }
}