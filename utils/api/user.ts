
import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";

import { SECRET } from "utils/constants";
import { getTokenData } from "services";
import { User as UserModel, Collection as UserCollection } from 'backend/models'

export class User extends UserModel {

    private data: any = {};
    private token: string = "";
    private req: NextApiRequest;
    private res: NextApiResponse;

    constructor(req: NextApiRequest, res: NextApiResponse) {
        super(req, res)
        this.req = req;
        this.res = res;
        const token: any = getCookie(SECRET, { req, res });
        this.token = token;
        const tokenData = getTokenData(token);
        if (tokenData) {
            this.data = tokenData.user;
        }
    }

    public getDVCollection = async () => {
        const collection = new UserCollection(this.req, this.res);
        const dvCollection = await collection.first("diamond-verse", {}, "slug");
        return dvCollection;
    }

    public get = (key?: string) => {
        if (typeof key === "undefined") {
            return this.data;
        }
        return this.data[key] || "";
    }

    public isAuthenticate = () => {
        return Object.keys(this.data).length && this.data.id;
    }

    public getToken = () => {
        return this.token;
    }

}