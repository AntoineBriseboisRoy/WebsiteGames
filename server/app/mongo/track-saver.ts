import { DbClient } from "./db-client";
import { Collection } from "mongodb";
import { ITrack } from "../../../common/interfaces/ITrack";

const TRACKS: string = "tracks";

export class TrackSaver {

    private  dbClient: DbClient;
    private  collection: Collection;

    public constructor() {
        this.dbClient = new DbClient();
    }

    public async postTrack(track: ITrack): Promise<ITrack> {
        return this.connectToClient()
        .then(() => {
            delete track._id;
            this.collection.insertOne(track).catch((error: Error) => console.error(error));

            return track;
        });
    }

    public async putTrack(name: string, track: ITrack): Promise<ITrack> {
        return this.connectToClient()
        .then(() => {
            delete track._id;
            this.collection.replaceOne({name: name}, track, { upsert: true }).catch((error: Error) => console.error(error));

            return track;
        });
    }

    public async deleteTrack(name: string): Promise<string> {
        return this.connectToClient()
        .then(() => {
            this.collection.deleteOne({name: name}).catch((error: Error) => console.error(error));

            return name;
        });
    }

    public async getTrack(name: string): Promise<ITrack> {
        return this.connectToClient()
        .then(async () => {
            return this.collection.findOne({name: name}).catch((error: Error) => console.error(error));
        });
    }

    public async getAllTracks(): Promise<ITrack[]> {
        return this.connectToClient()
        .then(async () => {
            return this.collection.find<ITrack>().toArray();
        });
    }

    private async connectToClient(): Promise<void> {
        return this.dbClient.connect().then(() => {
            if (this.dbClient.DB !== undefined) {
                this.collection = this.dbClient.DB.collection(TRACKS);
        }});
    }
}
