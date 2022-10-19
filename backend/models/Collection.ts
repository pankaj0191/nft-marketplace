import { optionProps } from '@types';
import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'

import Model from "./Model";

export class Collection extends Model {

    collection: string = "collections";

    private defaultPipeline: any = [
        {
            $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "creator",
            },
        },
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category",
            },
        },
        {
            $lookup: {
                from: "genries",
                localField: "genre",
                foreignField: "_id",
                as: "genre",
            },
        },
        {
            $lookup: {
                from: "nfts",
                let: { collectionId: "$_id" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$collection", "$$collectionId"] } } },
                    { $count: "count" }
                ],
                as: "nfts",
            }
        },
        { $unwind: "$category" },
        { $unwind: "$genre" },
        { $unwind: "$creator" },
    ];

    constructor(req: NextApiRequest, res: NextApiResponse) {
        super("collections", req, res);
    }

    getCollectionById = async (id: string = "", options = {}) => {
        options = typeof options === 'object' && options ? options : {};
        var pipeline = this.defaultPipeline;
        if (id) {
            pipeline = [...pipeline, { $match: { _id: new ObjectId(id) } }];
        } else {
            pipeline = [...pipeline, { $match: { slug: "diamond-verse" } }]
        }
        return await this.aggregate(pipeline, "single");
    }

    getAll = async (options: optionProps) => {
        let {
            skip = 0,
            match = {},
            limit = 0,
            sortBy = "updatedAt",
            sort = -1,
            others = []
        } = options;
        sortBy = typeof sortBy === "object" ? sortBy : [sortBy];
        let pipeline = [...this.defaultPipeline, { $sort: { sortBy: sort } }, ...others];
        if (Object.keys(match).length) {
            pipeline = [...pipeline, { $match: match }];
        }
        if (limit > 0) {
            pipeline = [...pipeline, { $limit: limit + skip }];
        }
        if (skip > 0) {
            pipeline = [...pipeline, { $skip: skip }];
        }
        return await this.aggregate(pipeline);

    }

    getOtherDetails = async (objectId: ObjectId, options: any = {}) => {
        options = typeof options === 'object' && options ? options : [];
        const { nft, owner, floorPrice } = options;
        const pipeline = [
            { $match: { _id: objectId } },
        ];
        if (nft) {
            const nftPipe: any = {
                $lookup: {
                    from: "nfts",
                    localField: "_id",
                    foreignField: "collectionId",
                    as: "nfts",
                }
            }
            pipeline.push(nftPipe);
        }
        if (owner) {
            const ownerPipe: any = {
                $lookup: {
                    from: "nfts",
                    pipeline: [
                        { $match: { collectionId: objectId } },
                        { $group: { _id: "$createdBy", nftCount: { $sum: 1 } } },
                    ],
                    as: "owners"
                }
            }
            pipeline.push(ownerPipe);
        }
        if (floorPrice) {
            const floorPricePipe: any = {
                $lookup: {
                    from: "nfts",
                    pipeline: [
                        { $match: { collectionId: objectId } },
                        {
                            $group: {
                                _id: null,
                                averageQuantity: { $sum: "$price" },
                                count: { $sum: 1 }
                            }
                        },
                    ],
                    as: "floor_price"
                }
            }
            pipeline.push(floorPricePipe);
        }
        return await this.aggregate(pipeline, "single");
    }

}