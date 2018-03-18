import { Injectable } from "@angular/core";
import { INewGame } from "../../../../../common/interfaces/INewGame";

@Injectable()
export class WaitingGamesService {
    private games: Array<INewGame>;

    public constructor() {
        this.games = new Array<INewGame>();
    }

    public get Games(): Array<INewGame> {
        return this.games;
    }

    public pushNewGame(game: INewGame): void {
        this.games.push(game);
    }
}
