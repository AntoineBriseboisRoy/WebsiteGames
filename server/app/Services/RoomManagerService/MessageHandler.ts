import { SocketService } from "../SocketService/SocketService";
import { RoomManagerService } from "./RoomManagerService";
import { INewGame } from "../../../../common/interfaces/INewGame";
import { RoomState } from "../../../../common/constants";
import { Room } from "./room";
import { IGridWord } from "../../../../common/interfaces/IGridWord";
import { Player } from "../../player";
import { IPlayer } from "../../../../common/interfaces/IPlayer";
import { Observer } from "rxjs/Observer";
import { Observable } from "rxjs/Observable";

export class MessageHandler {
    private socket: SocketIO.Socket;
    public constructor() {
        this.socket = undefined;
    }
    public init(socket: SocketIO.Socket): void {
        this.socket = socket;
        this.getEvent("waiting-room").subscribe(()                      => this.joinWaitingRoom());
        this.getEvent("new-game").subscribe((data: string)              => this.createNewGame(JSON.parse(data)));
        this.getEvent("delete-game").subscribe((data: string)           => this.deleteGame(JSON.parse(data)));
        this.getEvent("play-single-game").subscribe((data: string)      => this.playASinglePlayerGame(JSON.parse(data)));
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
        SocketService.Instance.socketIo.in(this.socket.id).emit("waiting-room", RoomManagerService.Instance.getWaitingGames());
    }
    private createNewGame(game: INewGame): void {
        this.createNewRoom(game).then(() => {
            this.socket.in("waiting-room").broadcast.emit("new-game", {
                userCreator: game.userCreator,
                userCreatorID: this.socket.id,
                difficulty: game.difficulty,
                userJoiner: ""
            });
            this.socket.join(RoomManagerService.Instance.getRoom(this.socket.id).Name);
        }).catch((error: Error) => console.error(error));
    }

    private deleteGame(game: INewGame): void {
        RoomManagerService.Instance.deleteRoom(this.socket.id);
        this.socket.in("waiting-room").broadcast.emit("delete-game", game);
    }

    // TODO: Ajouter type d'erreur pour le .catch
    private playASinglePlayerGame(game: INewGame): void {
        game.userCreatorID = this.socket.id;
        this.createNewRoom(game).then(() => {
            const room: Room = RoomManagerService.Instance.getRoom(game.userCreatorID);
            room.state = RoomState.Playing;
            this.socket.join(room.Name);
            this.sendGrid(room);
        }).catch((error: Error) => console.error(error));
    }
    private playAMultiplayerGame(game: INewGame): void {
        const room: Room = RoomManagerService.Instance.getRoom(game.userCreatorID);
        RoomManagerService.Instance.addPlayerToRoom(game.userJoiner, this.socket.id, room.Name);
        room.state = RoomState.Playing;
        this.socket.join(room.Name);
        this.socket.to(game.userCreatorID).emit("play-multiplayer-game", game);
        this.sendGrid(room);
    }

    private completeAWord(word: IGridWord): void {
        const room: Room = RoomManagerService.Instance.getRoom(this.socket.id);
        room.setWordFound(word, this.socket.id);
        SocketService.Instance.socketIo.in(room.Name).emit("update-score", this.parseToIPlayers(room.Players));
        SocketService.Instance.socketIo.in(room.Name).emit("selected-word", room.Players.map((player: Player) => player.selectedWord));
        this.sendGrid(room);
    }

    private selectAWord(word: Array<IGridWord>): void {
        const room: Room = RoomManagerService.Instance.getRoom(this.socket.id);
        room.selectWord(word[0], this.socket.id);
        SocketService.Instance.socketIo.in(room.Name).emit("selected-word", room.Players.map((player: Player) => player.selectedWord));
    }

    private disconnect(): void {
        console.warn("Disconnect: ", this.socket.id);
        const room: Room = RoomManagerService.Instance.getRoom(this.socket.id);
        if (room) {
            SocketService.Instance.socketIo.in(room.Name).emit("disconnected-player",
                                                               room.Players.map((player: Player) => player.selectedWord));
            RoomManagerService.Instance.deleteRoom(this.socket.id);
        }
    }

    private sendGrid(room: Room): void {
        SocketService.Instance.socketIo.in(room.Name).emit("grid-cells", room.Cells);
        SocketService.Instance.socketIo.in(room.Name).emit("grid-words", room.Words);
    }

    private async createNewRoom(game: INewGame): Promise<void> {
        const player: Player = new Player(game.userCreator, this.socket.id);
        const room: Room = new Room(player, game.difficulty, this.socket.id);
        RoomManagerService.Instance.push(room);
        await room.initializeGrid();
    }

    private parseToIPlayers(players: Array<Player>): Array<IPlayer> {
        const iPlayers: Array<IPlayer> = new Array<IPlayer>();
        players.forEach((player: Player) => {
            iPlayers.push({ username: player.username, score: player.score });
        });

        return iPlayers;
    }
}
