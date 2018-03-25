import { ICell } from "../../common/interfaces/ICell";
import { IGridWord } from "../../common/interfaces/IGridWord";
import { WordTransmitterService } from "./Services/WordTransmitterService/wordTransmitter.service";
import { Difficulty } from "../../common/constants";

export class GridInPlay {
    private gridCells: Array<ICell>;
    private gridWords: Array<IGridWord>;
    public difficulty: Difficulty;
    public constructor() {
        this.gridCells = new Array<ICell>();
        this.gridWords = new Array<IGridWord>();
        this.generateGrid();
    }

    public get Cells(): Array<ICell> {
        return this.gridCells;
    }

    public get Words(): Array<IGridWord> {
        return this.gridWords;
    }

    private generateGrid(): void {
        this.gridCells = WordTransmitterService.Instance.getCells();
        this.gridWords = WordTransmitterService.Instance.getTransformedWords();
    }
}
