import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClientOptions, ObjectId } from 'mongodb'

import { MongoDbClient } from 'utils/api/mongodb'

import type { InsertInputProps, UpdateInputProps } from '@types';
import { getCookie } from 'cookies-next';
import { APP_BASE_URL, SECRET } from 'utils';
import { getTokenData } from 'services';

export class Model extends MongoDbClient {

    protected request: NextApiRequest;
    protected response: NextApiResponse;
    protected userToken: string;
    protected user: any = {};
    protected collection: string;
    private   notAuthenticatedUrls: any;

    private MongodbClientOptions: MongoClientOptions = {
        // serverSelectionTimeoutMS: 10, 
        connectTimeoutMS: 20000
    };

    constructor(collection: string, req: NextApiRequest, res: NextApiResponse, urls: any = []) {
        super();
        this.collection = collection;
        this.request = req;
        this.response = res;
        this.notAuthenticatedUrls = urls?.length ? urls.filter((url: string) => url) : typeof urls === "string" && urls === "*" ? "*" : [];
        const token: any = getCookie(SECRET, { req, res });
        const tokenData = getTokenData(token);
        // if(!tokenData) throw new Error("Invalid token");
        
        this.userToken = token;
        if (tokenData) {
            this.user = tokenData.user;
        }
    }

    connectDb = async () => {
        await this.connect(`${this.mongodbUri}/${this.database}`, this.collection, this.MongodbClientOptions);
        if (!this.db) {
            throw new Error("Database connection failed!");
        }
    }

    async get(options: any = {}) {
        try {
            await this.connectDb();
            const result = await this.db.find(options).toArray();
            return result;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async first(
        value: string | string[],
        options: any = {},
        column: string = "_id"
    ) {
        try {
            await this.connectDb();
            if (column === "_id") {
                if (typeof value === "string") {
                    options._id = new ObjectId(value);
                } else if (typeof value === "object") {
                    options._id = value.map(v => new ObjectId(v)).filter(v => v);
                }
            } else {
                options[column] = value;
            }
            let result = await this.get(options);
            if (result.length) {
                result = result.shift();
                result.id = result._id;
                delete result._id;
                return result;
            }
            return false;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async insert(inputData: any, options: any = {}) {
        try {
            await this.connectDb();
            const restricted = typeof options.restricted === "boolean" ? options.restricted : true;
            const checkpublicUrl = this.checkAuthentication();
            if(!checkpublicUrl && !this.user.id) throw new Error("You are not authenticated"); 
            if (this.request.method === 'POST' || !restricted) {
                // Process a POST request
                const newInputData: InsertInputProps = {
                    ...inputData,
                    createdBy: new ObjectId(this.user.id),
                    updatedBy: new ObjectId(this.user.id),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
                const result = await this.db.insertOne(newInputData);
                return {
                    _id: result.insertedId ? result.insertedId.toString() : ""
                };
            } else {
                throw new Error("Invalid Method");
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async update(value: string | string[], inputData: any, options: any ={}, column: string = "_id") {
        try {
            await this.connectDb();
            const restricted = typeof options.restricted === "boolean" ? options.restricted : true;
            if(!this.user.id) throw new Error("You are not authenticated"); 
            if (this.request.method?.trim().toLocaleUpperCase() === 'PUT' || !restricted) {
                const query: any = {};
                if (column === "_id") {
                    if (typeof value === "string") {
                        query._id = new ObjectId(value);
                    } else if (typeof value === "object") {
                        query._id = value.map(v => new ObjectId(v)).filter(v => v);
                    }
                } else {
                    query[column] = value;
                }
                if(typeof inputData.createdAt !== "undefined") delete inputData.createdAt;
                if(typeof inputData.createdBy !== "undefined") delete inputData.createdBy;
                const newInputData: UpdateInputProps = {
                    ...inputData,
                    updatedBy: new ObjectId(this.user.id),
                    updatedAt: new Date(),
                }
                const result = await this.db.updateOne(
                    query,
                    { $set: newInputData }
                )
                return result.acknowledged ? true : false;
            } else {
                throw new Error("Invalid Method");
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async delete(value: any | string[], _id: string = "_id") {
        try {
            await this.connectDb();
            if(!this.user.id) throw new Error("You are not authenticated"); 
            if (this.request.method === 'DELETE') {
                const query: any = {};
                if (_id === "_id") {
                    if (typeof value === "string") {
                        query._id = new ObjectId(value);
                    } else if (typeof value === "object") {
                        // query._id = value.map(v => new ObjectId(v)).filter(v => v);
                    }
                } else {
                    query[_id] = value;
                }
                try {
                    const result = await this.db.deleteOne(query);;
                    return result;
                } catch (error: any) {
                    throw new Error(error.message);
                }
            } else {
                throw new Error("Invalid Method");
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    aggregate = async (pipeline: any, res: string = "multi") => {
        try {
            await this.connectDb();
            let result = (await this.db?.aggregate(pipeline).toArray()) || [];
            result = result.filter((i: any) => {
                i.id = i._id;
                delete i._id;
                return i
            });
            if (res === "single") {
                return result?.shift() || false;
            }
            return result;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    checkAuthentication = () => {
        const query: any = this.request.query || {};
        const currentUrl = this.request.url?.slice(-1) === "/" ? this.request.url?.slice(0, -1) : (this.request.url || "");
        if(this.notAuthenticatedUrls === "*") {
            return true;
        } else {
            for (let index = 0; index < this.notAuthenticatedUrls.length; index++) {
                var url = this.notAuthenticatedUrls[index];
                url = url?.slice(-1) === "/" ? url?.slice(0, -1) : (url || "");
                const params = url.match(/[^[\]]+(?=])/g) || [];
                params.forEach((param: string) => {
                    url = url.replace(`[${param}]`, query[param]);
                });
                const checkUrl = '/api'+url;
                if(currentUrl === checkUrl) return true;
            }
            return false;
        }

    }
}


export default Model