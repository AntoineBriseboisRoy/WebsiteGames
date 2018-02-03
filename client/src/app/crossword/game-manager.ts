import { OnInit } from "@angular/core";
import {Difficulty} from "../constants";

// Singleton class
export class GameManager implements OnInit {
    private static instance: GameManager;
    private difficulty: Difficulty;
    private twoPlayer: boolean;

    public static getInstance(): GameManager {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        this.difficulty = Difficulty.Easy;
        this.twoPlayer = true;
     }

    public ngOnInit(): void {
        this.difficulty = Difficulty.Easy;
        this.twoPlayer = true;
    }

    public getDifficulty(): string {
        return this.difficulty;
    }

    public isMultiplayer(): boolean {
        return this.twoPlayer;
    }
}
