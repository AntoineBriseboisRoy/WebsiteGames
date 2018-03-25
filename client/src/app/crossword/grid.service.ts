import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs/Observable";
import { catchError } from "rxjs/operators";
import { of } from "rxjs/observable/of";

import { SocketIoService } from "./socket-io.service";
import { GameManager } from "./game-manager";
import { IGridWord } from "../../../../common/interfaces/IGridWord";
import { ICell } from "../../../../common/interfaces/ICell";
import { Observer } from "rxjs/Observer";

@Injectable()
export class GridService {
    private readonly BASE_URL: string;
    public gridCells: Array<ICell>;
    public gridWords: Array<IGridWord>;

    public constructor(private http: HttpClient, private socketIO: SocketIoService) {
        this.BASE_URL = "http://localhost:3000/";
        this.gridCells = new Array();
        this.gridWords = new Array();
    }

    public fetchGrid(): Observable<void> {
        return Observable.create( (obs: Observer<void>) => {
            this.getCells().subscribe((gridCells: Array<ICell>) => {
                this.gridCells = gridCells;
                this.fetchGridWords(obs);
            });
        });
    }

    private fetchGridWords(obs: Observer<void>): void {
        this.getWords().subscribe((gridWords: Array<IGridWord>) => {
            this.gridWords = gridWords;
            this.setGridWordsReferencesToGridCells();
            obs.next(null);
        });
    }

    private setGridWordsReferencesToGridCells(): void {
        for (const word of this.gridWords) {
            for (let i: number = 0; i < word.cells.length; i++) {
                word.cells[i] = this.gridCells[word.cells[i].gridIndex];
            }
        }
    }

    private getCells(): Observable<Array<ICell>> {
        if (!GameManager.Instance.isMultiplayer) {
            const gridURL: string = this.BASE_URL + "getGrid";

            return this.http.get<Array<ICell>>(gridURL).pipe(
                catchError(this.handleError<Array<ICell>>("getGrid"))
            );
        } else {
            return this.socketIO.GridContent;
        }
    }

    private getWords(): Observable<Array<IGridWord>> {
        if (!GameManager.Instance.isMultiplayer) {
            const wordsURL: string = this.BASE_URL + "getWords";

            return this.http.get<Array<IGridWord>>(wordsURL).pipe(
                catchError(this.handleError<Array<IGridWord>>("getWords"))
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
