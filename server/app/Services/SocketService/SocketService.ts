import * as http from "http";
import * as io from "socket.io";
import { INewGame } from "../../../../common/interfaces/INewGame";
// import { WaitingGamesService } from "../Multiplayer-menu-service/waiting-games.service";
// import { IGameInProgress } from "../../../../common/interfaces/IGameInProgress";
// import { GamesInProgressService } from "../GamesInProgress";
import { Room } from "../../room";
import { Player } from "../../player";
import { RoomState } from "../../../../common/constants";

const ID_NOT_FOUND: number = -1;

export class SocketService {

    private static instance: SocketService;
    private socketIo: SocketIO.Server;
    private rooms: Array<Room>;

    public static get Instance(): SocketService {
        if (!this.instance) {
            this.instance = new SocketService();
        }

        return this.instance;
    }
    private constructor() {
        this.rooms = new Array<Room>();
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
        socket.on("waiting-room", () => {
            socket.join("waiting-room");
            this.socketIo.to(socket.id).emit("waiting-room", this.getWaitingGames());
        });
    }
    private createNewGame(socket: SocketIO.Socket): void {
        socket.on("new-game", (data: string) => {
            const game: INewGame = JSON.parse(data);
            this.rooms.push(new Room(new Player(game.userCreator, socket.id), game.difficulty));
            socket.in("waiting-room").broadcast.emit("new-game", game);
        });
    }
    private deleteGame(socket: SocketIO.Socket): void {
        socket.on("delete-game", (data: string) => {
            const game: INewGame = JSON.parse(data);
            this.deleteRoom(socket.id);
            socket.in("waiting-room").broadcast.emit("delete-game", game);
        });
    }
    private playAGame(socket: SocketIO.Socket): void {
        socket.on("play-game", (data: string) => {
            // const game: INewGame = JSON.parse(data);
            // 1. add player to waiting game
            // 2. change state of game to playing
            // 3. send Grid to client

            // socket.join(game.userCreator);
            // socket.in("waiting-room").broadcast.emit("play-game", game);
            // const gameInProgress: IGameInProgress = GamesInProgressService.Instance.getGameInProgress(game.userCreator);
            // this.socketIo.in(game.userCreator).emit("grid-content", gameInProgress.gridContent);
            // this.socketIo.in(game.userCreator).emit("grid-words", gameInProgress.gridWords);
        });
    }
    private disconnectSocket(socket: SocketIO.Socket): void {
        socket.on("disconnect", () => {
            console.warn("disconnect");
        });
    }

    private deleteRoom(socketId: string): void {
        const index: number = this.findRoom(socketId);
        if (index !== ID_NOT_FOUND) {
            this.rooms.splice(index, 1);
        }
    }

    private findRoom(socketId: string): number {
        let index: number = 0;
        let roomFound: boolean = false;
        while (index < this.rooms.length && !roomFound) {
            if (this.rooms[index++].isPlayerInRoom(socketId)) {
                roomFound = true;
            }
        }

        return roomFound ? index - 1 : ID_NOT_FOUND;
    }

    private getWaitingGames(): Array<INewGame> {
        const waitingGames: Array<INewGame> = new Array<INewGame>();
        this.rooms.forEach((room: Room ) => {
            if (room.State === RoomState.Waiting) {
                waitingGames.push({userCreator: room.Players[0].username, difficulty: room.Difficulty});
            }
        });

        return waitingGames;
    }
}
