import { Injectable } from "@angular/core";
import { INewGame } from "../../../../../common/interfaces/INewGame";
import { GameManagerService } from "../game-manager.service";
import { SocketIoService } from "../socket-io.service";

@Injectable()
export class GameRoomManagerService {
    public createdGame: INewGame;
    private games: Array<INewGame>;

    public constructor(private gameManagerService: GameManagerService, private socketIo: SocketIoService) {
        this.games = new Array<INewGame>();
        this.socketIo.WaitingRoom.subscribe((games: Array<INewGame>) => this.init(games));
    }

    public get Games(): Array<INewGame> {
        return this.games;
    }

    public init(games: Array<INewGame>): void {
        this.games = games;
    }

    public push(game: INewGame): void {
        this.games.push(game);
    }
    public remove(game: INewGame): void {
        const index: number = this.games.findIndex((waitingGame: INewGame) =>
            waitingGame.userCreator === game.userCreator);
        this.games.splice(index, 1);
    }

    public isDefined(): boolean {
        return this.createdGame !== undefined;
    }

    public canJoinGame(gameToPlay: INewGame): boolean {
        return this.isDefined() && this.createdGame.userCreator === gameToPlay.userCreator;
    }

    public setGame(gameToPlay: INewGame): void {
        this.gameManagerService.difficulty = gameToPlay.difficulty;
        this.gameManagerService.isMultiplayer = true;
        this.gameManagerService.players[0].username = gameToPlay.userCreator;
        this.gameManagerService.players[1].username = gameToPlay.userJoiner;
    }

    public isUsernameUnique(username: string): boolean {
        const foundGame: INewGame = this.games.find((game: INewGame) =>
            this.deleteWhiteSpace(game.userCreator) === this.deleteWhiteSpace(username));

        return (foundGame === undefined);
    }
    private deleteWhiteSpace(word: string): string {
        return word.replace(/\s/g, "");
    }
}
