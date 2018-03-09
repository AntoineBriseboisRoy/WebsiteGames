import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IBasicTrackInfo } from "../../../common/interfaces/IBasicTrackInfo";
import { plainToClass, deserialize, deserializeArray } from "class-transformer";
import { ITrack } from "../../../common/interfaces/ITrack";

@Injectable()
export class MongoQueryService {

    private readonly BASE_URL: string = "http://localhost:3000/";
    public constructor(private http: HttpClient) { }

    public postTrack(track: ITrack): Promise<void | ITrack> {

        return this.http.post(this.BASE_URL + "postTrack", track).toPromise().then((data: ITrack) => {
            return data;
        }).catch((error: Error) => {
            console.error(error);
        });
    }

    public putTrack(basicTrackInfo: IBasicTrackInfo): Promise<void | ITrack> {

        return this.http.put(this.BASE_URL + "putTrack", basicTrackInfo).toPromise().then((data: ITrack) => {
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

    public getTrack(name: string): Promise<void | ITrack> {

        return this.http.get<ITrack>(this.BASE_URL + "getTrack").toPromise().then((track: ITrack) => {
            return track;
        }).catch((error: Error) => {
           console.error(error);
        });
    }

    public getAllTracks(): Promise<void | ITrack[]> {

        return this.http.get<ITrack[]>(this.BASE_URL + "getAllTracks").toPromise()
        .then((tracks: ITrack[]) => {

            return tracks as ITrack[];
        })
        .catch((error: Error) => {
           console.error(error);
        });
    }
}
