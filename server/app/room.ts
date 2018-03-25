import { GridInPlay } from "./gridInPlay";
import { Player } from "./player";
import { RoomState, Difficulty } from "../../common/constants";

export class Room {
    private grid: GridInPlay;
    private players: Array<Player>;
    private state: RoomState;

    public constructor(playerOne: Player, difficulty: Difficulty) {
        this.players = new Array<Player>();
        this.players.push(playerOne);
        this.state = RoomState.Waiting;
        this.grid = new GridInPlay();
        this.grid.difficulty = difficulty;
    }

    public get Players(): Array<Player> {
        return this.players;
    }

    public get State(): RoomState {
        return this.state;
    }

    public get Difficulty(): Difficulty {
        return this.grid.difficulty;
    }

    public addPlayer(socketID: string, username: string): void {
        this.players.push(new Player(username, socketID));
    }
    public isPlayerInRoom(socketId: string): boolean {
        return this.players.some((player: Player) => player.socketID === socketId);
    }
}
