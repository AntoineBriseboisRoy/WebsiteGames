import { DbClient } from "./db-client";
import { Collection, ObjectId } from "mongodb";
import { Track } from "../../../client/src/app/admin-section/track";
import { IBasicTrackInfo } from "../../../common/interfaces/IBasicTrackInfo";

const TRACKS: string = "tracks";

export class TrackSaver {

    private  dbClient: DbClient;
    private  collection: Collection;

    public constructor() {
        this.dbClient = new DbClient();
    }

    public postTrack(track: Track): Promise<Track> {
        return this.connectToClient()
        .then(() => {
            this.collection.insertOne(track);

            return track;
        });
    }

    public putTrack(info: IBasicTrackInfo): Promise<Track> {
        return this.connectToClient()
        .then(() => {
            this.collection.replaceOne({_id: new ObjectId(info.name)}, info.track);

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

    public getTrack(name: string): Promise<Track> {
        return this.connectToClient()
        .then(() => {
            return this.collection.findOne({_id: new Object(name)});
        });
    }

    public getAllTracks(): Promise<Track[]> {
        return this.connectToClient()
        .then(() => {
            return this.collection.find<Track>().toArray();
        });
    }

    private connectToClient(): Promise<void> {
        return this.dbClient.connect().then(() => {
            if (this.dbClient.DB !== undefined) {
                this.collection = this.dbClient.DB.collection(TRACKS);
        }});
    }
}
