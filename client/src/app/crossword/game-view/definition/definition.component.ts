import { Component, OnInit } from "@angular/core";
import { NO_CHEAT_COLOR, CHEAT_COLOR, Orientation } from "../../../constants";
import { WordTransmitterService } from "../../game-view/wordTransmitter.service";
import { IGridWord } from "../../interfaces/IGridWord";
import { FocusCell } from "../focusCell";
import { ICell } from "../../interfaces/ICell";

@Component({
    selector: "app-crossword-definition",
    templateUrl: "./definition.component.html",
    styleUrls: ["./definition.component.css"]
})

export class DefinitionComponent implements OnInit {
    public choosedDefinition: string;
    public cheatModeActive: boolean;
    public gridWordsHorizontal: Array<IGridWord>;
    public gridWordsVertical: Array<IGridWord>;

    private cheatButtonColor: string;
    private gridWords: Array<IGridWord>;
    private focusCell: FocusCell;

    public constructor(private wordTransmitterService: WordTransmitterService) {
        this.choosedDefinition = "";
        this.cheatModeActive = false;
        this.gridWordsHorizontal = [];
        this.gridWordsVertical = [];
        this.cheatButtonColor = NO_CHEAT_COLOR;
        this.gridWords = [];
        this.focusCell = FocusCell.Instance;
    }

    public ngOnInit(): void {
        document.getElementById("cheat-button").style.backgroundColor = this.cheatButtonColor;
        this.wordTransmitterService.getTransformedWords().subscribe((gridWords: Array<IGridWord>) => {
            this.gridWords = gridWords;
            this.gridWords = gridWords.sort(this.compareIndex);
            this.splitHorizontalAndVerticalWords();
        });
    }

    public focusOnCell(choosedDefinition: string): void {
        this.gridWords.forEach((word: IGridWord, index: number) => {
            if (word.definition === choosedDefinition) {
                this.focusCell.Cell = word.cells[this.firstUnknownCell(word.cells)];
                this.focusCell.Cells = word.cells;
                this.focusCell.Orientation = word.orientation;
                this.choosedDefinition = word.definition;
                if (this.isAlreadyFoundWord()) {
                    this.focusCell.clear();
                    this.choosedDefinition = undefined;
                }
            }
        });
    }

    public toogleCheatMode(): void {
        this.cheatModeActive = !this.cheatModeActive;
        this.cheatButtonColor = this.cheatModeActive ? CHEAT_COLOR : NO_CHEAT_COLOR;
        document.getElementById("cheat-button").style.backgroundColor = this.cheatButtonColor;
    }

    public cheatModeToString(): string {
        return this.cheatModeActive ? "CHEAT MODE ACTIVATE!" : "Click to activate Cheat Mode";
    }
    private firstUnknownCell(cells: Array<ICell>): number {
        for (let i: number = 0; i < cells.length; i++) {
            if (!cells[i].isFound) {
                return i;
            }
        }

        return 0;
    }

    private isAlreadyFoundWord(): boolean {
        let isFoundWord: boolean = true;
        this.focusCell.Cells.forEach((cell: ICell) => {
            if (!cell.isFound) {
                isFoundWord = false;
            }
        });

        return isFoundWord;
    }

    private splitHorizontalAndVerticalWords(): void {
        this.gridWords.forEach((word: IGridWord) => {
            if (word.orientation === Orientation.Horizontal) {
                this.gridWordsHorizontal.push(word);
            } else {
                this.gridWordsVertical.push(word);
            }
        });
    }

    private compareIndex(a: IGridWord, b: IGridWord): number {
        return a.cells[0].index - b.cells[0].index;
    }
}
