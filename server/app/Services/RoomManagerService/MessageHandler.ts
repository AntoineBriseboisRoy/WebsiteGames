import { RoomManagerService } from "./RoomManagerService";
import { INewGame } from "../../../../common/interfaces/INewGame";
import { RoomState, GameOutcome } from "../../../../common/constants";
import { Room } from "./room";
import { IGridWord } from "../../../../common/interfaces/IGridWord";
import { Player } from "../../player";
import { IPlayer } from "../../../../common/interfaces/IPlayer";
import { IEndGame } from "../../../../common/interfaces/IEndGame";
import { IRestartGame } from "../../../../common/interfaces/IRestartGame";
import { Observer } from "rxjs/Observer";
import { Observable } from "rxjs/Observable";
import { inject, injectable } from "inversify";
import Types from "../../types";

@injectable()
export class MessageHandler {
    private socketServer: SocketIO.Server;
    private socket: SocketIO.Socket;
    public constructor(@inject(Types.RoomManagerService) private roomManagerService: RoomManagerService) {
        this.socket = undefined;
    }
    public init(socket: SocketIO.Socket, socketServer: SocketIO.Server): void {
        this.socket = socket;
        this.socketServer = socketServer;
        this.getEvent("waiting-room").subscribe(()                      => this.joinWaitingRoom());
        this.getEvent("new-game").subscribe((data: string)              => this.createNewGame(JSON.parse(data)));
        this.getEvent("delete-game").subscribe((data: string)           => this.deleteGame(JSON.parse(data)));
        this.getEvent("start-game").subscribe((data: string)            => this.startGame(JSON.parse(data)));
        this.getEvent("restart-game").subscribe((data: string)          => this.restartGame(JSON.parse(data)));
        this.getEvent("play-multiplayer-game").subscribe((data: string) => this.playAMultiplayerGame(JSON.parse(data)));
        this.getEvent("completed-word").subscribe((data: string)        => this.completeAWord(JSON.parse(data)));
        this.getEvent("selected-word").subscribe((data: string)         => this.selectAWord(JSON.parse(data)));
        this.getEvent("disconnect").subscribe(()                        => this.disconnect());
    }
    private getEvent(name: string): Observable<string> {
        return Observable.create((observer: Observer<string>) => {
            this.socket.on(name, (data: string) => observer.next(data));
        });
    }

    private joinWaitingRoom(): void {
        this.socket.join("waiting-room");
        this.socketServer.in(this.socket.id).emit("waiting-room", this.roomManagerService.getWaitingGames());
    }
    private createNewGame(game: INewGame): void {
        this.createNewRoom(game).then(() => {
            this.socket.in("waiting-room").broadcast.emit("new-game", {
                userCreator: game.userCreator,
                userCreatorID: this.socket.id,
                difficulty: game.difficulty,
                userJoiner: ""
            });
            this.socket.join(this.roomManagerService.getRoom(this.socket.id).Name);
        }).catch((error: Error) => console.error(error));
    }

    private deleteGame(game: INewGame): void {
        this.roomManagerService.deleteRoom(this.socket.id);
        this.socket.in("waiting-room").broadcast.emit("delete-game", game);
    }

    // TODO: Ajouter type d'erreur pour le .catch
    private startGame(game: INewGame): void {
        game.userCreatorID = this.socket.id;
        this.createNewRoom(game).then(() => {
            const room: Room = this.roomManagerService.getRoom(game.userCreatorID);
            room.state = RoomState.Playing;
            this.socket.join(room.Name);
            this.sendGrid(room);
        }).catch((error: Error) => console.error(error));
    }

    private restartGame(game: IRestartGame): void {
        const room: Room = this.roomManagerService.getRoom(this.socket.id);
        if (room) {
            if (game.requestSent) {
                this.socket.to(room.getOtherPlayer(this.socket.id).socketID).emit("restart-game", game);
            } else {
                if (game.requestAccepted) {
                    room.initializeGrid().then(() => {
                        room.state = RoomState.Playing;
                        this.socket.to(room.Name).emit("restart-game", {requestSent: false, requestAccepted: true});
                        this.socketServer.in(room.Name).emit("update-score", this.parseToIPlayers(room.Players));
                        this.sendGrid(room);
                    });
                } else {
                    this.socket.to(room.getOtherPlayer(this.socket.id).socketID)
                                .emit("restart-game", {requestSent: false, requestAccepted: false});
                }
            }
        } else {
            console.error("Error");
        }
    }

    private playAMultiplayerGame(game: INewGame): void {
        const room: Room = this.roomManagerService.getRoom(game.userCreatorID);
        this.roomManagerService.addPlayerToRoom(game.userJoiner, this.socket.id, game.userCreatorID);
        room.state = RoomState.Playing;
        this.socket.join(room.Name);
        this.socket.to(game.userCreatorID).emit("play-multiplayer-game", game);
        this.sendGrid(room);
    }

    private completeAWord(word: IGridWord): void {
        const room: Room = this.roomManagerService.getRoom(this.socket.id);
        room.setWordFound(word, this.socket.id);
        this.socketServer.in(room.Name).emit("update-score", this.parseToIPlayers(room.Players));
        this.socketServer.in(room.Name).emit("selected-word", room.Players.map((player: Player) => player.selectedWord));
        this.sendGrid(room);
        this.checkEndGame(room);
    }

    private checkEndGame(room: Room): void {
        if (room.isGridCompleted()) {
            if (room.Players.length === 1) {
                this.socketServer.in(room.Name).emit("grid-completed",
                                                     { Winner: this.parseToIPlayer(room.Players[0]),
                                                       Outcome: GameOutcome.Win });
            } else {
                this.handleMultiplayerEndGame(room);
            }
            room.clearGame();
        }
    }

    private handleMultiplayerEndGame(room: Room): void {
        switch (this.getGameOutcome(room.Players[0], room.Players[1])) {
            case GameOutcome.Lose:
                this.emitEndGame(room, 1);
                break;
            case GameOutcome.Win:
                this.emitEndGame(room, 0);
                break;
            case GameOutcome.Tie:
                this.socketServer.to(room.Name).emit("grid-completed", { Outcome: GameOutcome.Tie });
                break;
            default: break;
        }
    }

    private emitEndGame(room: Room, indexWinner: number): void {
        const indexLoser: number = indexWinner === 0 ? 1 : 0;
        const endgame: IEndGame = {
            Winner: this.parseToIPlayer(room.Players[indexWinner]),
            Loser: this.parseToIPlayer(room.Players[indexLoser]),
            Outcome: GameOutcome.Win
        };
        this.socketServer.to(room.Players[indexWinner].socketID).emit("grid-completed", endgame);
        endgame.Outcome = GameOutcome.Lose;
        this.socketServer.to(room.Players[indexLoser].socketID).emit("grid-completed", endgame);
    }

    private selectAWord(word: Array<IGridWord>): void {
        const room: Room = this.roomManagerService.getRoom(this.socket.id);
        room.selectWord(word[0], this.socket.id);
        this.socketServer.in(room.Name).emit("selected-word", room.Players.map((player: Player) => player.selectedWord));
    }
    private getGameOutcome(playerReceiver: Player, otherPlayer: Player): GameOutcome {
        const scoreDifference: number = playerReceiver.score - otherPlayer.score;
        if (scoreDifference === 0) {
            return GameOutcome.Tie;
        } else if (scoreDifference < 0) {
            return GameOutcome.Lose;
        } else {
            return GameOutcome.Win;
        }
    }

    private disconnect(): void {
        console.warn("Disconnect: ", this.socket.id);
        const room: Room = this.roomManagerService.getRoom(this.socket.id);
        if (room) {
            this.socketServer.in(room.Name).emit("disconnected-player",
                                                 room.Players.map((player: Player) => player.selectedWord));
            this.roomManagerService.deleteRoom(this.socket.id);
        }
    }

    private sendGrid(room: Room): void {
        this.socketServer.in(room.Name).emit("grid-cells", room.Cells);
        this.socketServer.in(room.Name).emit("grid-words", room.Words);
    }

    private async createNewRoom(game: INewGame): Promise<void> {
        const player: Player = new Player(game.userCreator, this.socket.id);
        const room: Room = new Room(player, game.difficulty, game.userCreatorID);
        this.roomManagerService.push(room);
        await room.initializeGrid();
    }

    private parseToIPlayers(players: Array<Player>): Array<IPlayer> {
        const iPlayers: Array<IPlayer> = new Array<IPlayer>();
        players.forEach((player: Player) => {
            iPlayers.push(this.parseToIPlayer(player));
        });

        return iPlayers;
    }

    private parseToIPlayer(player: Player): IPlayer {
        return { username: player.username, score: player.score };
    }
}
