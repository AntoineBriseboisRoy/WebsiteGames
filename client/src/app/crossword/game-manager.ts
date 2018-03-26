import { Difficulty } from "../constants";
import { Player } from "./player";

export class GameManager {
    private static instance: GameManager;
    public isMultiplayer: boolean;
    public difficulty: Difficulty;
    public playerOne: Player;
    public playerTwo: Player;

    public static get Instance(): GameManager {
        if (this.instance === undefined) {
            this.instance = new this();
        }

        return this.instance;
    }

    private constructor() {
        this.playerOne = new Player("Claudia", 0);
        this.playerTwo = new Player("Antoine", 0);
        this.difficulty = Difficulty.Easy;
        this.isMultiplayer = false;
    }
}
