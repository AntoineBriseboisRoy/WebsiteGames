import { GridInPlay } from "./gridInPlay";
import { Player } from "../../player";
import { RoomState, Difficulty, GameOutcome } from "../../../../common/constants";
import { IGridWord } from "../../../../common/interfaces/IGridWord";
import { ICell, Finder } from "../../../../common/interfaces/ICell";
import { IPlayer } from "../../../../common/interfaces/IPlayer";

const ROOM_NAME_OFFSET: string = "a";

export class Room {
    public state: RoomState;
    private grid: GridInPlay;
    private players: Array<Player>;
    private name: string;

    public constructor(playerOne: Player, difficulty: Difficulty, name: string) {
        this.players = new Array<Player>();
        this.players.push(playerOne);
        this.state = RoomState.Waiting;
        this.grid = new GridInPlay(difficulty);
        this.name = name + ROOM_NAME_OFFSET;
    }

    public get Players(): Array<Player> {
        return this.players;
    }

    public get IPlayers(): Array<IPlayer> {
        const iPlayers: Array<IPlayer> = new Array<IPlayer>();
        this.players.forEach((player: Player) => {
            iPlayers.push(player.toIPlayer());
        });

        return iPlayers;
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

    public async initializeGrid(): Promise<void> {
        await this.grid.generateGrid();
    }
    public isGridCompleted(): boolean {
        return this.grid.isGridCompleted();
    }
    public addPlayer(username: string, socketID: string): void {
        this.players.push(new Player(username, socketID));
    }
    public isPlayerInRoom(socketId: string): boolean {
        return this.players.some((player: Player) => player.socketID === socketId);
    }
    public clear(): void {
        this.grid.clear();
        this.players.forEach((player: Player) => player.clear());
    }
    public clearGame(): void {
        this.grid.clear();
        this.players.forEach((player: Player) => player.score = 0);
    }
    public getOtherPlayer(socketId: string): Player {
        const foundPlayer: Player = this.players.find((player: Player) => player.socketID === socketId);
        if (foundPlayer) {
            return this.players.find((currentPlayer: Player) => currentPlayer !== foundPlayer);
        }

        return undefined;
    }
    public setWordFound(word: IGridWord, socketId: string): void {
        word.cells.forEach((cell: ICell) => {
            cell.isFound = true;
            cell.finder = this.identifyFinder(cell, socketId);
        });
        this.grid.setWordToFound(word);
        this.setScore(socketId);
        this.deselectWord(socketId);
    }
    public selectWord(word: IGridWord, socketId: string): void {
        const foundPlayer: Player = this.players.find((player: Player) => player.socketID === socketId);
        if (foundPlayer) {
            foundPlayer.selectedWord = word;
        }
    }

    public getGameOutcome(): GameOutcome {
        const scoreDifference: number = this.players[0].score - this.players[1].score;
        if (scoreDifference === 0) {
            return GameOutcome.Tie;
        } else if (scoreDifference < 0) {
            return GameOutcome.Lose;
        } else {
            return GameOutcome.Win;
        }
    }
    private deselectWord(socketId: string): void {
        const foundPlayer: Player = this.players.find((player: Player) => player.socketID === socketId);
        if (foundPlayer) {
            foundPlayer.selectedWord = undefined;
        }
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
