import * as http from "http";
import * as io from "socket.io";
import { INewGame } from "../../../../common/interfaces/INewGame";
import { WaitingGamesService } from "../Multiplayer-menu-service/waiting-games.service";
import { IGameInProgress } from "../../../../common/interfaces/IGameInProgress";
import { GamesInProgressService } from "../GamesInProgress";

export class SocketService {

    private static instance: SocketService;
    private socketIo: SocketIO.Server;

    public static get Instance(): SocketService {
        if (!this.instance) {
            this.instance = new SocketService();
        }

        return this.instance;
    }
    private init(server: http.Server): void {
        this.socketIo = io(server);
    }
    public connect(server: http.Server): void {
        this.init(server);
        this.socketIo.on("connection", (receivedSocket: SocketIO.Socket) => {
            this.joinWaitingRoom(receivedSocket);
            this.createNewGame(receivedSocket);
            this.deleteGame(receivedSocket);
            this.playAGame(receivedSocket);
            this.disconnectSocket(receivedSocket);
        });

    }
    private joinWaitingRoom(socket: SocketIO.Socket): void {
        socket.on("waiting-room", () => socket.join("waiting-room"));
    }
    private createNewGame(socket: SocketIO.Socket): void {
        socket.on("new-game", (data: string) => {
            const game: INewGame = JSON.parse(data);
            socket.join(GamesInProgressService.Instance.createNewGame(game.userCreator).roomName);
            WaitingGamesService.Instance.pushNewGame(game);
            console.log((WaitingGamesService.Instance.Games.length));
            socket.in("waiting-room").broadcast.emit("new-game", game);
        });
    }
    private deleteGame(socket: SocketIO.Socket): void {
        socket.on("delete-game", (data: string) => {
            const game: INewGame = JSON.parse(data);
            WaitingGamesService.Instance.remove(game);
            console.log("disconnect", (WaitingGamesService.Instance.Games.length));
            socket.in("waiting-room").broadcast.emit("delete-game", game);
        });
    }
    private playAGame(socket: SocketIO.Socket): void {
        socket.on("play-game", (data: string) => {
            const game: INewGame = JSON.parse(data);
            socket.join(game.userCreator);
            WaitingGamesService.Instance.remove(game);
            console.log((WaitingGamesService.Instance.Games.length));
            socket.in("waiting-room").broadcast.emit("play-game", game);
            const gameInProgress: IGameInProgress = GamesInProgressService.Instance.getGameInProgress(game.userCreator);
            this.socketIo.in(game.userCreator).emit("grid-content", gameInProgress.gridContent);
            this.socketIo.in(game.userCreator).emit("grid-words", gameInProgress.gridWords);
        });
    }
    private disconnectSocket(socket: SocketIO.Socket): void {
        socket.on("disconnect", () => {
            console.warn("disconnect");
        });
    }
}
