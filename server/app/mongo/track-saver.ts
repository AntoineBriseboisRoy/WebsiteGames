import { DbClient } from "./mongo";
import { Collection, InsertOneWriteOpResult, DeleteWriteOpResultObject, ReplaceWriteOpResult, ObjectId } from "mongodb";
import { Schema } from "mongoose";
import { Track } from "../../../client/src/app/admin-section/track";

const TRACKS: string = "tracks";

export class TrackSaver {

    private dbClient: DbClient;
    private collection: Collection<Schema>;

    public constructor() {
        this.dbClient = new DbClient();
    }

    private connectToClient(): void {
        if (this.dbClient != null) {
            this.collection = this.dbClient.DB.collection(TRACKS);
        }
    }

    private postTrack(track: Track): Promise<InsertOneWriteOpResult> {
        this.connectToClient();

        return this.collection.insertOne(track);
    }

    private putTrack(name: string, track: Track): Promise<ReplaceWriteOpResult> {
        this.connectToClient();

        return this.collection.replaceOne({_id: new ObjectId(name)}, track);
    }

    private deleteTrack(name: string): Promise<DeleteWriteOpResultObject> {
        this.connectToClient();

        return this.collection.deleteOne(name);
    }

    private getTrack(name: string): Promise<Track> {
        this.connectToClient();

        return this.collection.findOne({_id: new Object(name)});
    }

    private getAllTracks(): Promise<Schema[]> {
        this.connectToClient();

        return this.collection.find({}).toArray();
    }
}
