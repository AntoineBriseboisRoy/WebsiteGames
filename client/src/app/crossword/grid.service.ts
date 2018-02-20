import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs/Observable";
import { catchError } from "rxjs/operators";
import { of } from "rxjs/observable/of";

import { IWord } from "../../../../common/Word";

@Injectable()
export class GridService {

    private readonly BASE_URL: string = "http://localhost:3000/";
    public constructor(private http: HttpClient) { }

    public getGrid(): Observable<String> {
        const gridURL: string = this.BASE_URL + "getGrid";

        return this.http.get<String>(gridURL).pipe(
            catchError(this.handleError<String>("getGrid"))
        );
    }

    public getWords(): Observable<Array<IWord>> {
        const wordsURL: string = this.BASE_URL + "getWords";

        return this.http.get<Array<IWord>>(wordsURL).pipe(
            catchError(this.handleError<Array<IWord>>("getWords"))
        );
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {

        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
