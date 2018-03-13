import { DbClient } from "./db-client";
import { Collection } from "mongodb";
import { IBasicTrackInfo } from "../../../common/interfaces/IBasicTrackInfo";
import { ITrack } from "../../../common/interfaces/ITrack";

const TRACKS: string = "tracks";

export class TrackSaver {

    private  dbClient: DbClient;
    private  collection: Collection;

    public constructor() {
        this.dbClient = new DbClient();
    }

    public postTrack(track: ITrack): Promise<ITrack> {
        return this.connectToClient()
        .then(() => {
            delete track._id;
            this.collection.insertOne(track);

            return track;
        });
    }

    public putTrack(info: IBasicTrackInfo): Promise<ITrack> {
        return this.connectToClient()
        .then(() => {
            delete info.track._id;
            this.collection.replaceOne({}, info.track);

            return info.track;
        });
    }

    public deleteTrack(name: string): Promise<string> {
        return this.connectToClient()
        .then(() => {
            this.collection.deleteOne(name);

            return name;
        });
    }

    public getTrack(name: string): Promise<ITrack> {
        return this.connectToClient()
        .then(() => {
            return this.collection.findOne({name: name});
        });
    }

    public getAllTracks(): Promise<ITrack[]> {
        return this.connectToClient()
        .then(() => {
            return this.collection.find<ITrack>().toArray();
        });
    }

    private connectToClient(): Promise<void> {
        return this.dbClient.connect().then(() => {
            if (this.dbClient.DB !== undefined) {
                this.collection = this.dbClient.DB.collection(TRACKS);
        }});
    }
}