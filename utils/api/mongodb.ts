import { MongoClient, MongoClientOptions } from 'mongodb'

export class MongoDbClient {

    protected database: string;
    protected mongodbUri: string;
    protected client: MongoClient | undefined;

    public version: string = "";
    public db: any;


    constructor(
        db?: string | undefined,
        dbUrl?: string,
    ) {
        this.mongodbUri = this.filterMongoDbUrl(dbUrl);
        this.database = this.filterMongoDatabase(db);
    }

    async connect(uri: string, collection: string, options: MongoClientOptions) {
        // let mongoClient: MongoClient;
        try {
            // if (process.env.NODE_ENV === "development") {
                // In development mode, use a global variable so that the value
                // is preserved across module reloads caused by HMR (Hot Module Replacement).

                let globalWithMongoClientPromise = global as typeof globalThis & {
                    _mongoClientPromise: MongoClient;
                };

                if (!globalWithMongoClientPromise._mongoClientPromise) {
                    globalWithMongoClientPromise._mongoClientPromise = await MongoClient.connect(uri, options);
                }

                this.client = globalWithMongoClientPromise._mongoClientPromise;
            // } else {
            //     // In production mode, it's best to not use a global variable.
            //     this.client = await MongoClient.connect(uri, options);
            // }
            if (collection) {
                this.db = this.client.db(this.database).collection(collection);
            }
        } catch (error: any) {
            console.log(error)
            throw new Error(error.message);
        }
    }

    filterMongoDbUrl = (str: any) => {
        const newStr: string = typeof str === "string" && str.trim() ? str.trim() : (process.env.MONGODB_URI || "mongodb://localhost:27017");
        if (!newStr) {
            throw new Error("Please add your MONGODB_URI to .env");
        }
        return newStr.slice(-1) === "/" ? newStr.slice(0, -1) : newStr;
    }

    filterMongoDatabase = (str: any) => {
        const newStr: string = typeof str === "string" && str.trim() ? str.trim() : (process.env.MONGODB_NAME || "dimaond-verse");
        if (!newStr) {
            throw new Error("Please add your MONGODB_NAME to .env");
        }
        return newStr.slice(0) === "/" ? newStr.slice(1) : newStr;
    }

    async getCollection(collection: string) {
        if (this.client) {
            return this.client
                .db(this.database)
                .collection(collection).find({});
        }
        return false;
    }
}