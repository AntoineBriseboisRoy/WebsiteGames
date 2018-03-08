import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Track } from "./admin-section/track";
import { IBasicTrackInfo } from "../../../common/interfaces/IBasicTrackInfo";
import { plainToClass, deserialize, deserializeArray } from "class-transformer";

@Injectable()
export class MongoQueryService {

    private readonly BASE_URL: string = "http://localhost:3000/";
    public constructor(private http: HttpClient) { }

    public postTrack(track: Track): Promise<void | Track> {

        return this.http.post(this.BASE_URL + "postTrack", track).toPromise().then((data: Track) => {
            return data;
        }).catch((error: Error) => {
            console.error(error);
        });
    }

    public putTrack(basicTrackInfo: IBasicTrackInfo): Promise<void | Track> {

        return this.http.put(this.BASE_URL + "putTrack", basicTrackInfo).toPromise().then((data: Track) => {
            return data;
        }).catch((error: Error) => {
            console.error(error);
        });
    }

    public deleteTrack(name: string): Promise<void | string> {

        return this.http.post(this.BASE_URL + "deleteTrack", name).toPromise().then((data: string) => {
            return data;
        }).catch((error: Error) => {
            console.error(error);
        });
    }

    public getTrack(name: string): Promise<void | Track> {

        return this.http.get<Track>(this.BASE_URL + "getTrack").toPromise().then((track: Track) => {
            return track;
        }).catch((error: Error) => {
           console.error(error);
        });
    }

    public getAllTracks(): Promise<void | Track[]> {

        return this.http.get<Track[]>(this.BASE_URL + "getAllTracks").toPromise()
        .then((tracks: Track[]) => {

            return tracks as Track[];
        })
        .catch((error: Error) => {
           console.error(error);
        });
    }
}
