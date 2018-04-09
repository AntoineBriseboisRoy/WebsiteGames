import { GridInPlay } from "./gridInPlay";
import { Player } from "../../player";
import { RoomState, Difficulty } from "../../../../common/constants";
import { IGridWord } from "../../../../common/interfaces/IGridWord";
import { ICell, Finder } from "../../../../common/interfaces/ICell";

export class Room {
    public state: RoomState;
    private grid: GridInPlay;
    private players: Array<Player>;
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

    public addPlayer(username: string, socketID: string): void {
        this.players.push(new Player(username, socketID));
    }
    public isPlayerInRoom(socketId: string): boolean {
        return this.players.some((player: Player) => player.socketID === socketId);
    }

    public setWordFound(word: IGridWord, socketId: string): void {
        word.cells.forEach((cell: ICell) => {
            cell.isFound = true;
            cell.finder = this.identifyFinder(cell, socketId);
        });
        this.grid.setWordToFound(word);
        this.setScore(socketId);
    }

    public setWordSelected(word: IGridWord, socketId: string): void {
        const foundPlayer: Player = this.players.find((player: Player) => player.socketID === socketId);
        if (foundPlayer) {
            foundPlayer.selectedWord = word;
        }
    }

    public clear(): void {
        this.grid.clear();
        this.players.forEach((player: Player) => player.clear());
    }

    private identifyFinder(cell: ICell, playerId: string): Finder {
        const finder: Finder = this.players.findIndex((player: Player) => player.socketID === playerId);
        if (cell.finder === Finder.nobody || cell.finder === finder) {
            return finder;
        } else {
            return Finder.both;
        }
    }

    private setScore(socketId: string): void {
        const foundPlayer: Player = this.players.find((player: Player) => player.socketID === socketId);
        if (foundPlayer) {
            foundPlayer.addPoints();
        }
    }
}
