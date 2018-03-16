import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ITrack } from "../../../common/interfaces/ITrack";

@Injectable()
export class MongoQueryService {

    private readonly BASE_URL: string;
    public constructor(private http: HttpClient) {
        this.BASE_URL = "http://localhost:3000/";
     }

    public postTrack(track: ITrack): Promise<void | ITrack> {
        return this.http.post(`${this.BASE_URL}postTrack`, track).toPromise().then((data: ITrack) => {
            return data;
        }).catch((error: Error) => {
            console.error(error);
        });
    }

    public putTrack(name: string, track: ITrack): Promise<void | ITrack> {
        return this.http.put(`${this.BASE_URL}putTrack?name=${name}`, track).toPromise().then((data: ITrack) => {
            return data;
        }).catch((error: Error) => {
            console.error(error);
        });
    }

    public deleteTrack(name: string): Promise<void | string> {
        return this.http.post(`${this.BASE_URL}deleteTrack`, name).toPromise().then((data: string) => {
            return data;
        }).catch((error: Error) => {
            console.error(error);
        });
    }

    public getTrack(name: string): Promise<void | ITrack> {
        return this.http.get<ITrack>(`${this.BASE_URL}getTrack?name=${name}`).toPromise().then((track: ITrack) => {
            return track;
        }).catch((error: Error) => {
           console.error(error);
        });
    }

    public getAllTracks(): Promise<void | ITrack[]> {
        return this.http.get<ITrack[]>(`${this.BASE_URL}getAllTracks`).toPromise()
        .then((tracks: ITrack[]) => {
            return tracks as ITrack[];
        })
        .catch((error: Error) => {
           console.error(error);
        });
    }
}
