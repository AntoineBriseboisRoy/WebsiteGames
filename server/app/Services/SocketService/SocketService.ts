import * as http from "http";
import * as io from "socket.io";
import { INewGame } from "../../../../common/interfaces/INewGame";
import { Room } from "../RoomManagerService/room";
import { Player } from "../../player";
import { RoomState } from "../../../../common/constants";
import { RoomManagerService } from "../RoomManagerService/RoomManagerService";

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
        socket.on("waiting-room", () => {
            socket.join("waiting-room");
            this.socketIo.to(socket.id).emit("waiting-room", RoomManagerService.Instance.getWaitingGames());
        });
    }
    private createNewGame(socket: SocketIO.Socket): void {
        socket.on("new-game", (data: string) => {
            const game: INewGame = JSON.parse(data);
            RoomManagerService.Instance.push(new Room(new Player(game.userCreator, socket.id), game.difficulty, socket.id));
            socket.in("waiting-room").broadcast.emit("new-game", {
                userCreator: game.userCreator,
                userCreatorID: socket.id,
                difficulty: game.difficulty,
                userJoiner: ""
            });
            socket.join(RoomManagerService.Instance.getRoom(socket.id).Name);
        });
    }
    private deleteGame(socket: SocketIO.Socket): void {
        socket.on("delete-game", (data: string) => {
            const game: INewGame = JSON.parse(data);
            RoomManagerService.Instance.deleteRoom(socket.id);
            socket.in("waiting-room").broadcast.emit("delete-game", game);
        });
    }
    private playAGame(socket: SocketIO.Socket): void {
        socket.on("play-game", (data: string) => {
            const game: INewGame = JSON.parse(data);
            const room: Room = RoomManagerService.Instance.getRoom(game.userCreatorID);
            RoomManagerService.Instance.addPlayerToRoom(game.userJoiner, socket.id, room.Name);
            room.state = RoomState.Playing;
            socket.join(room.Name);
            socket.to(game.userCreatorID).emit("play-game", game);
            this.socketIo.in(room.Name).emit("grid-cells", room.Cells);
            this.socketIo.in(room.Name).emit("grid-words", room.Words);
        });
    }
    private disconnectSocket(socket: SocketIO.Socket): void {
        socket.on("disconnect", () => {
            console.warn("disconnect");
        });
    }
}
