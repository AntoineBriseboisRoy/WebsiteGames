import { Injectable } from "@angular/core";
import { INewGame } from "../../../../../common/interfaces/INewGame";
import { GameManager } from "../game-manager";

@Injectable()
export class GameRoomManagerService {
    private games: Array<INewGame>;
    public createdGame: INewGame;

    public constructor() {
        this.games = new Array<INewGame>();
    }

    public init(games: Array<INewGame>): void {
        this.games = games;
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

    public isDefined(): boolean {
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

    public canJoinGame(gameToPlay: INewGame): boolean {
        return this.isDefined() && this.createdGame.userCreator === gameToPlay.userCreator;
    }

    public setGame(gameToPlay: INewGame): void {
        GameManager.Instance.difficulty = gameToPlay.difficulty;
        GameManager.Instance.isMultiplayer = true;
        GameManager.Instance.playerOne.username = gameToPlay.userCreator;
        GameManager.Instance.playerTwo.username = gameToPlay.userJoiner;
    }
}
