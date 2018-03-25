import { GridInPlay } from "./gridInPlay";
import { Player } from "./player";
import { RoomState, Difficulty } from "../../common/constants";
import { IGridWord } from "../../common/interfaces/IGridWord";
import { ICell } from "../../common/interfaces/ICell";

export class Room {
    private grid: GridInPlay;
    private players: Array<Player>;
    private state: RoomState;
    private name: string;

    public constructor(playerOne: Player, difficulty: Difficulty, name: string) {
        this.players = new Array<Player>();
        this.players.push(playerOne);
        this.state = RoomState.Waiting;
        this.grid = new GridInPlay();
        this.grid.difficulty = difficulty;
        this.name = name;
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

    public get Name(): string {
        return this.name;
    }

    public get Words(): Array<IGridWord> {
        return this.grid.Words;
    }

    public get Cells(): Array<ICell> {
        return this.grid.Cells;
    }

    public addPlayer(socketID: string, username: string): void {
        this.players.push(new Player(username, socketID));
    }
    public isPlayerInRoom(socketId: string): boolean {
        return this.players.some((player: Player) => player.socketID === socketId);
    }
}
