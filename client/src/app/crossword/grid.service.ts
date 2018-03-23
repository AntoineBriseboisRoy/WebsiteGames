import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs/Observable";
import { catchError } from "rxjs/operators";
import { of } from "rxjs/observable/of";

import { IWord } from "../../../../common/interfaces/IWord";
import { SocketIoService } from "./socket-io.service";
import { GameManager } from "./game-manager";

@Injectable()
export class GridService {

    private readonly BASE_URL: string;
    public constructor(private http: HttpClient, private socketIO: SocketIoService) {
        this.BASE_URL = "http://localhost:3000/";
    }

    public getGrid(): Observable<String> {
        if (!GameManager.Instance.isMultiplayer) {
            const gridURL: string = this.BASE_URL + "getGrid";

            return this.http.get<String>(gridURL).pipe(
                catchError(this.handleError<String>("getGrid"))
            );
        } else {
            return this.socketIO.GridContent;
        }
    }

    public getWords(): Observable<Array<IWord>> {
        if (!GameManager.Instance.isMultiplayer) {
            const wordsURL: string = this.BASE_URL + "getWords";

            return this.http.get<Array<IWord>>(wordsURL).pipe(
                catchError(this.handleError<Array<IWord>>("getWords"))
            );
        } else {
            return this.socketIO.GridWords;
        }
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {

        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
