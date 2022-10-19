import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import Model from "./Model";
import { User } from "./User";


export class Follower extends Model {

    collection: string = "followers";

    constructor(req: NextApiRequest, res: NextApiResponse) {
        super("followers", req, res);
    }

    // Follow By user

    followedByUser = async (userId: string) => {
        const UserModal = new User(this.request, this.response);
        const user = await UserModal.first(userId)
        if (!user) throw new Error("Invalid user id!");

        const id = new ObjectId(userId);
        const isFollowed = await this.aggregate([
            {
                $match: {
                    $and: [
                        { $expr: { $eq: ["$createdBy", new ObjectId(this.user.id)] } },
                        { $expr: { $eq: ["$userId", id] } }
                    ]
                }
            }
        ], 'single');
        if (isFollowed) throw new Error("Already followed this user!");
        return await this.insert({ userId: id })
    }

    // Unfollow By User

    unfollwedByUser = async (userId: string) => {
        await this.connectDb();
        return await this.db.deleteOne({
            userId: new ObjectId(userId),
            createdBy: new ObjectId(this.user.id)
        });
    }

    // Get Follow Data

    getFollowedUser = async (userId: string) => {
        const result = await this.get({
            userId: new ObjectId(userId),
            createdBy: new ObjectId(this.user.id)
        });
        return result.length ? {
            isFollowed: true,
            data: result.shift({})
        } : {
            isFollowed: false,
            data: {}
        };
    }

}







