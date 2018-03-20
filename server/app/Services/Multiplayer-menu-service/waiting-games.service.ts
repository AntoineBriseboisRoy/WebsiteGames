
import { INewGame } from "../../../../common/interfaces/INewGame";

export class WaitingGamesService {

    private static instance: WaitingGamesService;
    private games: Array<INewGame>;

    private constructor() {
        this.games = new Array<INewGame>();
    }
    public static get Instance(): WaitingGamesService {
        if (!this.instance) {
            this.instance = new WaitingGamesService();
        }

        return this.instance;
    }

    public get Games(): Array<INewGame> {
        return this.games;
    }

    public pushNewGame(game: INewGame): void {
        this.games.push(game);
    }

    public remove(game: INewGame): void {
        const index: number = this.games.findIndex((waitingGame: INewGame) => waitingGame.userCreator === game.userCreator);
        this.games.splice(index, 1);
    }
}
