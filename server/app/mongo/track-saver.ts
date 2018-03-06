import { DbClient } from "./db-client";
import { Collection, InsertOneWriteOpResult, DeleteWriteOpResultObject, ReplaceWriteOpResult, ObjectId } from "mongodb";
import { Track } from "../../../client/src/app/admin-section/track";

const TRACKS: string = "tracks";

export class TrackSaver {

    private  dbClient: DbClient;
    private  collection: Collection;

    public constructor() {
        this.dbClient = new DbClient();
    }

    public postTrack(track: Track): Promise<InsertOneWriteOpResult> {
        return this.connectToClient()
        .then(() => {
            return this.collection.insertOne(track);
        });
    }

    public putTrack(name: string, track: Track): Promise<ReplaceWriteOpResult> {
        return this.connectToClient()
        .then(() => {
            return this.collection.replaceOne({_id: new ObjectId(name)}, track);
        });
    }

    public deleteTrack(name: string): Promise<DeleteWriteOpResultObject> {
        return this.connectToClient()
        .then(() => {
            return this.collection.deleteOne(name);
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
            return this.collection.find<Track>({}).toArray();
        });
    }

    private connectToClient(): Promise<void> {
        return this.dbClient.connect().then(() => {
            if (this.dbClient.DB !== undefined) {
                this.collection = this.dbClient.DB.collection(TRACKS);
        }});
    }
}
