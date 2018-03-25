import { Difficulty } from "../../../../common/constants";
import { IPlayer } from "./game-view/IPlayer";

export class GameManager {
    private static instance: GameManager;
    public isMultiplayer: boolean;
    public difficulty: Difficulty;
    public playerOne: IPlayer;
    public playerTwo: IPlayer;

    public static get Instance(): GameManager {
        if (this.instance === undefined) {
            this.instance = new this();
        }

        return this.instance;
    }

    private constructor() {
        this.playerOne = {username: "Claudia", score: 0 };
        this.playerTwo = {username: "Antoine", score: 0 };
        this.difficulty = Difficulty.Easy;
        this.isMultiplayer = false;
    }
}
