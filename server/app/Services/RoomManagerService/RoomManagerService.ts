import { Room } from "./room";
import { INewGame } from "../../../../common/interfaces/INewGame";
import { RoomState } from "../../../../common/constants";

const ID_NOT_FOUND: number = -1;

export class RoomManagerService {

    private static instance: RoomManagerService;
    public static get Instance(): RoomManagerService {
        if (!this.instance) {
            this.instance = new RoomManagerService();
        }

        return this.instance;
    }
    private rooms: Array<Room>;
    private constructor() {
        this.rooms = new Array<Room>();
    }

    public push(room: Room): void {
        this.rooms.push(room);
    }
    public deleteRoom(socketId: string): void {
        const index: number = this.findRoom(socketId);
        if (index !== ID_NOT_FOUND) {
            this.rooms[index].clear();
            this.rooms.splice(index, 1);
        }
    }

    public getRoom(socketId: string): Room {
        const index: number = this.findRoom(socketId);
        if (index !== ID_NOT_FOUND) {
            return this.rooms[index];
        }

        return undefined;
    }

    public findRoom(socketId: string): number {
        let index: number = 0;
        let roomFound: boolean = false;
        while (index < this.rooms.length && !roomFound) {
            if (this.rooms[index++].isPlayerInRoom(socketId)) {
                roomFound = true;
            }
        }

        return roomFound ? index - 1 : ID_NOT_FOUND;
    }

    public getWaitingGames(): Array<INewGame> {
        const waitingGames: Array<INewGame> = new Array<INewGame>();
        this.rooms.forEach((room: Room) => {
            if (room.state === RoomState.Waiting) {
                waitingGames.push({
                    userCreator: room.Players[0].username, difficulty: room.Difficulty,
                    userJoiner: "", userCreatorID: room.Players[0].socketID
                });
            }
        });

        return waitingGames;
    }

    public addPlayerToRoom(playerName: string, playerId: string, roomName: string): void {
        const index: number = this.findRoom(roomName);
        if (index !== ID_NOT_FOUND) {
            this.rooms[index].addPlayer(playerName, playerId);
        }
    }
}
