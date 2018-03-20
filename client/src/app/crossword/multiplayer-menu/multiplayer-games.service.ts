import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { catchError } from "rxjs/operators";
import { of } from "rxjs/observable/of";
import { INewGame } from "../../../../../common/interfaces/INewGame";

@Injectable()
export class MultiplayerGamesService {
    private readonly BASE_URL: string;
    private games: Array<INewGame>;
    public createdGame: INewGame;

    public constructor(private http: HttpClient) {
        this.BASE_URL = "http://localhost:3000/";
        this.games = new Array<INewGame>();
    }

    public init(): void {
        this.getGamesServer().subscribe((games: Array<INewGame>) => {
            this.games = games;
        });
    }

    public remove(game: INewGame): void {
        const index: number = this.games.findIndex((waitingGame: INewGame) =>
            waitingGame.userCreator === game.userCreator);
        this.games.splice(index, 1);
    }

    public push(game: INewGame): void {
        this.games.push(game);
    }

    public get Games(): Array<INewGame> {
        return this.games;
    }

    public isWaiting(): boolean {
        return this.createdGame !== undefined;
    }

    public isUsernameUnique(username: string): boolean {
        const foundGame: INewGame = this.games.find((game: INewGame) =>
            this.deleteWhiteSpace(game.userCreator) === this.deleteWhiteSpace(username));

        return (foundGame === undefined);
    }
    private deleteWhiteSpace(word: string): string {
        return word.replace(/\s/g, "");
    }
    private getGamesServer(): Observable<Array<INewGame>> {
        const gridURL: string = this.BASE_URL + "getGames";

        return this.http.get<Array<INewGame>>(gridURL).pipe(
            catchError(this.handleError<Array<INewGame>>("getGames"))
        );
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {

        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
