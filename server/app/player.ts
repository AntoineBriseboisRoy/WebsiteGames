import { IGridWord } from "../../common/interfaces/IGridWord";
import { IPlayer } from "../../common/interfaces/IPlayer";

export class Player {
    public selectedWord: IGridWord;

    public constructor(public username: string, public socketID: string, public score: number = 0) {
        this.selectedWord = undefined;
    }

    public addPoints(): void {
        this.score += 1;
    }

    public clear(): void {
        this.username = "";
        this.score = 0;
    }

    public toIPlayer(): IPlayer {
        return { username: this.username, score: this.score };
    }
}
