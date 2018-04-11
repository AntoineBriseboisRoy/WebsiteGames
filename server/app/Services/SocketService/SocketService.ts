import * as http from "http";
import * as io from "socket.io";
import { INewGame } from "../../../../common/interfaces/INewGame";
import { Room } from "../RoomManagerService/room";
import { Player } from "../../player";
import { RoomState } from "../../../../common/constants";
import { RoomManagerService } from "../RoomManagerService/RoomManagerService";
import { IGridWord } from "../../../../common/interfaces/IGridWord";
import { IPlayer } from "../../../../common/interfaces/IPlayer";

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
            console.warn("Connected to", receivedSocket.id);
            this.joinWaitingRoom(receivedSocket);
            this.createNewGame(receivedSocket);
            this.deleteGame(receivedSocket);
            this.playAGame(receivedSocket);
            this.completeAWord(receivedSocket);
            this.selectAWord(receivedSocket);
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
            this.createNewRoom(game, socket).then( ()  => {
                socket.in("waiting-room").broadcast.emit("new-game", {
                    userCreator: game.userCreator,
                    userCreatorID: socket.id,
                    difficulty: game.difficulty,
                    userJoiner: ""
                });
                socket.join(RoomManagerService.Instance.getRoom(socket.id).Name);
            }).catch((error: Error) => console.error(error));
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
            const room: Room = this.addOtherPlayerToRoom(game, socket);
            socket.join(room.Name);
            socket.to(game.userCreatorID).emit("play-game", game);
            this.sendGrid(room);
        });
    }

    private completeAWord(socket: SocketIO.Socket): void {
        socket.on("completed-word", (data: string) => {
            const word: IGridWord = JSON.parse(data);
            const room: Room = RoomManagerService.Instance.getRoom(socket.id);
            room.setWordFound(word, socket.id);
            this.socketIo.in(room.Name).emit("update-score", this.parseToIPlayers(room.Players));
            this.sendGrid(room);
        });
    }

    private selectAWord(socket: SocketIO.Socket): void {
        socket.on("selected-word", (data: string) => {
            const word: Array<IGridWord> = JSON.parse(data);
            const room: Room = RoomManagerService.Instance.getRoom(socket.id);
            room.setWordSelected(word[0], socket.id);
            this.socketIo.in(room.Name).emit("selected-word", room.Players.map((player: Player) => player.selectedWord));
        });
    }

    private disconnectSocket(socket: SocketIO.Socket): void {
        socket.on("disconnect", () => {
            console.warn("Disconnect: ", socket.id);
        });
    }

    private sendGrid(room: Room): void {
        this.socketIo.in(room.Name).emit("grid-cells", room.Cells);
        this.socketIo.in(room.Name).emit("grid-words", room.Words);
    }

    private async createNewRoom(game: INewGame, socket: SocketIO.Socket): Promise<void> {
        const player: Player = new Player(game.userCreator, socket.id);
        const room: Room = new Room(player, game.difficulty, socket.id);
        RoomManagerService.Instance.push(room);
        await room.initializeGrid();
    }

    private addOtherPlayerToRoom(game: INewGame, socket: SocketIO.Socket): Room {
        let room: Room;
        if (this.isSinglePlayer(game)) {
            game.userCreatorID = socket.id;
            this.createNewRoom(game, socket);
            room = RoomManagerService.Instance.getRoom(game.userCreatorID);
        } else {
            room = RoomManagerService.Instance.getRoom(game.userCreatorID);
            RoomManagerService.Instance.addPlayerToRoom(game.userJoiner, socket.id, room.Name);
        }
        room.state = RoomState.Playing;

        return room;
    }

    private parseToIPlayers(players: Array<Player>): Array<IPlayer> {
        const iPlayers: Array<IPlayer> = new Array<IPlayer>();
        players.forEach((player: Player) => {
            iPlayers.push({ username: player.username, score: player.score });
        });

        return iPlayers;
    }

    private isSinglePlayer(game: INewGame): boolean {
        return game.userCreatorID === "";
    }
}
