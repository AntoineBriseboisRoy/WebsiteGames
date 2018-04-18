import { Grid } from "./Grid";
import { IWord, Orientation } from "../../../common/interfaces/IWord";
import { Difficulty } from "../../../common/constants";

export class GridGeneratorService {

    private grid: Grid;

    public constructor() {
        this.grid = new Grid(Difficulty.Easy);
    }

    public async createGrid(difficulty: Difficulty): Promise<void> {
        this.grid = new Grid(difficulty);
        await this.grid.fillGrid();
        for (const word of this.grid.Words) {
            word.orientation = (word.orientation === Orientation.Horizontal) ? Orientation.Vertical : Orientation.Horizontal;
            this.switchPos(word);
        }
    }

    private switchPos(word: IWord): void {
        const xTemp: number = word.position.x;
        word.position.x = word.position.y;
        word.position.y = xTemp;
    }

    public get Grid(): string {
        return this.grid.GridContent.toString().toUpperCase().replace(/,/gi, "");
    }

    public get Words(): Array<IWord> {
        return this.grid.Words;
    }
}
