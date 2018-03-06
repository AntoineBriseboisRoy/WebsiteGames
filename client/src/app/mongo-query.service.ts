import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
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
