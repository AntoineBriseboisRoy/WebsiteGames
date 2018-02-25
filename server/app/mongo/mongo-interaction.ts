import { DbClient } from "./db-client";
import { Collection, InsertOneWriteOpResult, DeleteWriteOpResultObject, ReplaceWriteOpResult, ObjectId } from "mongodb";
import { Track } from "../../../client/src/app/admin-section/track";

const TRACKS: string = "tracks";

export class TrackSaver {

    private dbClient: DbClient;
    private collection: Collection;

    public constructor() {
        this.dbClient = new DbClient();
    }

    public postTrack(track: Track): Promise<InsertOneWriteOpResult> {
        this.connectToClient();

        return this.collection.insertOne(track);
    }

    public putTrack(name: string, track: Track): Promise<ReplaceWriteOpResult> {
        this.connectToClient();

        return this.collection.replaceOne({_id: new ObjectId(name)}, track);
    }

    public deleteTrack(name: string): Promise<DeleteWriteOpResultObject> {
        this.connectToClient();

        return this.collection.deleteOne(name);
    }

    public getTrack(name: string): Promise<Track> {
        this.connectToClient();

        return this.collection.findOne({_id: new Object(name)});
    }

    public getAllTracks(): Promise<Track[]> {
        this.connectToClient();

        return this.collection.find<Track>({}).toArray();
    }

    private connectToClient(): void {
        if (this.dbClient != null) {
            this.collection = this.dbClient.DB.collection(TRACKS);
        }
    }
}
