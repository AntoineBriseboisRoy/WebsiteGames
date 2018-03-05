import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import * as requestPromise from "request-promise-native";
import { catchError } from "rxjs/operators";
import { of } from "rxjs/observable/of";
import { Message } from "../../../common/communication/message";
import { Track } from "./admin-section/track";

@Injectable()
export class MongoQueryService {

    private readonly BASE_URL: string = "http://localhost:3000/";
    public constructor(private http: HttpClient) { }

    public getTrack(): Promise<void | Track> {

        return this.http.get<Track>(this.BASE_URL + "getTrack").toPromise().then((track: Track) => {
            return track;
        }).catch((error: Error) => {
           console.error(error);
        });
    }

    public postTrack(track: Track): Promise<void | Track> {

        return this.http.post(this.BASE_URL + "postTrack", track).toPromise().then((data: Track) => {
            return data;
        }).catch((error: Error) => {
            console.error(error);
        });
    }
}
// public postTrack(track: Track): Promise<InsertOneWriteOpResult> {
//     this.connectToClient();

//     return this.collection.insertOne(track);
// }

// public putTrack(name: string, track: Track): Promise<ReplaceWriteOpResult> {
//     this.connectToClient();

//     return this.collection.replaceOne({_id: new ObjectId(name)}, track);
// }

// public deleteTrack(name: string): Promise<DeleteWriteOpResultObject> {
//     this.connectToClient();

//     return this.collection.deleteOne(name);
// }

// public getTrack(name: string): Promise<Track> {
//     this.connectToClient();

//     return this.collection.findOne({_id: new Object(name)});
// }

// public getAllTracks(): Promise<Track[]> {
//     this.connectToClient();

//     return this.collection.find<Track>({}).toArray();
// }
