import * as http from "http";
import * as io from "socket.io";
import { INewGame } from "../../../../common/interfaces/INewGame";
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
            this.rooms.push(new Room(new Player(game.userCreator, socket.id), game.difficulty, socket.id));
            socket.in("waiting-room").broadcast.emit("new-game", {
                userCreator: game.userCreator,
                userCreatorID: socket.id,
                difficulty: game.difficulty,
                userJoiner: ""
            });
            socket.join(this.getRoom(socket.id).Name);
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
            const game: INewGame = JSON.parse(data);
            this.addPlayerToWaitingRoom(game.userCreatorID, game, socket.id);
            const room: Room = this.getRoom(socket.id);
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

    private deleteRoom(socketId: string): void {
        const index: number = this.findRoom(socketId);
        if (index !== ID_NOT_FOUND) {
            this.rooms.splice(index, 1);
        }
    }

    private getRoom(socketId: string): Room {
        const index: number = this.findRoom(socketId);
        if (index !== ID_NOT_FOUND) {
            return this.rooms[index];
        }

        return undefined;
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
        this.rooms.forEach((room: Room) => {
            if (room.State === RoomState.Waiting) {
                waitingGames.push({
                    userCreator: room.Players[0].username, difficulty: room.Difficulty,
                    userJoiner: "", userCreatorID: room.Players[0].socketID
                });
            }
        });

        return waitingGames;
    }

    private addPlayerToWaitingRoom(userCreatorId: string, game: INewGame, userJoinerId: string): void {
        const index: number = this.findRoom(userCreatorId);
        if (index !== ID_NOT_FOUND) {
            this.rooms[index].addPlayer(userJoinerId, game.userJoiner);
        }
    }
}
