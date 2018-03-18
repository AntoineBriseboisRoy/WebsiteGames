import { Injectable } from "@angular/core";
import { INewGame } from "../../../../../common/interfaces/INewGame";

@Injectable()
export class WaitingGamesService {
    private waitingGames: Array<INewGame>;

    public constructor() {
        this.waitingGames = new Array<INewGame>();
    }

    public get WaitingGames(): Array<INewGame> {
        return this.waitingGames;
    }

    public pushNewGame(game: INewGame): void {
        this.waitingGames.push(game);
    }
}
