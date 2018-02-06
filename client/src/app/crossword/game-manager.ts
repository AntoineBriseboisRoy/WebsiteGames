import { OnInit } from "@angular/core";
import { Difficulty } from "../constants";
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
        this.difficulty = Difficulty.Easy;
        this.isMultiplayer = true;
    }

    public ngOnInit(): void {
        this.difficulty = Difficulty.Easy;
        this.isMultiplayer = true;
    }

    public getDifficulty(): string {
        return this.difficulty;
    }

    public get IsMultiplayer(): boolean {
        return this.isMultiplayer;
    }
}
