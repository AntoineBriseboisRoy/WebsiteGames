import { MongoClient, Db } from "mongodb";

const DB_USER: string = "samarss97";
const DB_PASSWD: string = "97Samuel";
const DB_NAME: string = "log2990-22";
const DB_HOST_ADDR: string = "ds247678.mlab.com";
const DB_PORT: number = 47678;
const DB_URL: string = "mongodb://" + DB_USER + ":" + DB_PASSWD + "@" + DB_HOST_ADDR + ":" + DB_PORT + "/" + DB_NAME;

export class DbClient {
    private db: Db;

    public get DB(): Db {
        return this.db;
    }

    public connect(): Promise<void> {
        return MongoClient.connect(DB_URL)
            .then((client: MongoClient) => {
                this.db = client.db(DB_NAME);
            }).catch((error: Error) => {
                console.error(error);
            });
    }
}
