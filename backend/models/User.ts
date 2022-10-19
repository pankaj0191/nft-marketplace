import { optionProps } from '@types';
import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'

import Model from "./Model";

export class User extends Model {

    collection: string = "users";

    public defaultPipeline = [
        {
            $lookup: {
                from: "followers",
                let: { userId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$createdBy", "$$userId"] }
                        }
                    },
                    {
                        $count: "count"
                    }

                ],
                as: "followings",
            }
        },
        {
            $lookup: {
                from: "followers",
                let: { userId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$userId", "$$userId"] }
                        }
                    },
                    {
                        $count: "count"
                    }

                ],
                as: "followers",
            }
        },
        {
            $lookup: {
                from: "nfts",
                let: { userId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$ownedBy", "$$userId"] }
                        }
                    },
                    { $count: "count" }
                ],
                as: "ownedNft",
            },
        },
        {
            $lookup: {
                from: "nfts",
                let: { userId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$createdBy", "$$userId"] }
                        }
                    },
                    { $count: "count" }
                ],
                as: "createdNft",
            },
        },
        {
            $lookup: {
                from: "collections",
                let: { userId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$createdBy", "$$userId"] }
                        }
                    },
                    {
                        $count: "count"
                    }

                ],
                as: "collections",
            }
        }
    ]

    constructor(req: NextApiRequest, res: NextApiResponse) {
        super("users", req, res, [
            '/login'
        ]);
    }

    getAll = async (options: optionProps) => {
        let {
            match,
            skip = 0,
            limit = 0,
            sortBy = "updatedAt",
            sort = -1,
            others = []
        } = options;

        sortBy = typeof sortBy === "object" ? sortBy : [sortBy];
        let pipeline: any = [...this.defaultPipeline, { $sort: { sortBy: sort } }, ...others];
        if (match) {
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


    getDetails = async (objectId: ObjectId, options = {}) => {
        options = typeof options === 'object' && options ? options : {};
        const pipeline: any = [...this.defaultPipeline, { $match: { _id: objectId } }];
        return await this.aggregate(pipeline, "single");
    }
}