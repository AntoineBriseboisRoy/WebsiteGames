import { OnInit } from "@angular/core";
import { Difficulty, DIFFICULTY_LENGHT } from "../constants";
import { Player } from "./player";

// Singleton class
export class GameManager implements OnInit {
    private static instance: GameManager;
    private difficulty: Difficulty;
    private isMultiplayer: boolean;

    public playerOne: Player;
    public playerTwo: Player;

    public static getInstance(): GameManager {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        this.playerOne = {
            name: "Claudia",
            point: 0
        };
        this.playerTwo = {
            name: "Antoine",
            point: 100
        };
        this.difficulty = Difficulty.Hard;
        this.isMultiplayer = true;
    }

    public ngOnInit(): void {
        this.isMultiplayer = true;
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
}
