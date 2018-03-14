import { Difficulty, DIFFICULTY_LENGHT } from "../constants";
import { Player } from "./player";

export class GameManager {
    private static instance: GameManager;
    private difficulty: Difficulty;
    private isMultiplayer: boolean;

    private playerOne: Player;
    private playerTwo: Player;

    public static get Instance(): GameManager {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        this.playerOne = new Player("Claudia", 0);
        this.playerTwo = new Player("Antoine", 0);
        this.difficulty = Difficulty.Easy;
        this.isMultiplayer = false;
    }

    public getDifficulty(): string {
        return this.difficulty.slice(DIFFICULTY_LENGHT); // Delete the "Difficulty." before the difficulty type
    }

    public setDifficulty(difficulty: Difficulty): void {
        this.difficulty = difficulty;
    }

    public get IsMultiplayer(): boolean {
        return this.isMultiplayer;
    }

    public get PlayerOne(): Player {
        return this.playerOne;
    }

    public get PlayerTwo(): Player {
        return this.playerTwo;
    }
}
