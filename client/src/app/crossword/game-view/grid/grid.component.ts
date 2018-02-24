import { Component, OnInit, HostListener} from "@angular/core";
import { GRID_WIDTH } from "../../../constants";

import { IGridWord } from "../../interfaces/IGridWord";
import { ICell, CellColor } from "../../interfaces/ICell";
import { FocusCell } from "../focusCell";
import { KeyboardInputManagerService } from "../keyboard-input-manager/keyboard-input-manager.service";
import { WordTransmitterService } from "../wordTransmitter.service";

@Component({
    selector: "app-crossword-grid",
    templateUrl: "./grid.component.html",
    styleUrls: ["./grid.component.css"],
    providers: [KeyboardInputManagerService]
})

export class GridComponent implements OnInit {
    private cells: Array<ICell>;
    private gridWords: Array<IGridWord>;
    private clickedWords: Array<IGridWord>;
    private clickedCell: ICell;
    private focusCell: FocusCell;

    private keyboardInputManagerService: KeyboardInputManagerService;
    public constructor(private wordTransmitterService: WordTransmitterService) {
        this.cells = new Array();
        this.gridWords = new Array<IGridWord>();
        this.clickedWords = new Array();
        this.focusCell = FocusCell.Instance;
    }

    public ngOnInit(): void {
        this.wordTransmitterService.getTransformedWords().subscribe((gridWords: Array<IGridWord>) => {
            this.gridWords = gridWords;
            this.wordTransmitterService.getCells().subscribe((gridCells: Array<ICell>) => {
                this.cells = gridCells;
                this.keyboardInputManagerService = new KeyboardInputManagerService(this.cells);
            });
        });
    }

    /*Fonctions appeler directement par le html*/

    public gridLineJump(index: number): string {
        return (index % GRID_WIDTH) === 0 ? "square clear" : "square";
    }

    public getCellType(color: CellColor): string {
        return color === CellColor.Black ? "black-square" : "white-square";
    }

    public focusOnCell(cell: ICell): void {
        if (this.clickedCell === cell) {    // if click on the same cell twice, switch to Vertical/Horizontal word
            this.chooseHorizontalOrVertical();
        } else {
            this.chooseNewWords(cell);
        }
    }

    private chooseHorizontalOrVertical(): void {
        if (this.clickedWords.length > 1) {
            this.focusCell.Cell = this.focusCell.Cell === this.clickedWords[0].cells[0] ?
                this.clickedWords[1].cells[0] : this.clickedWords[0].cells[0];
            this.focusCell.invertOrientation();
        }
    }

    private chooseNewWords(cell: ICell): void {
        this.clickedWords = [];
        this.gridWords.forEach((word: IGridWord, index: number) => {
            if (word.cells.includes(cell)) {
                this.clickedWords.push(word);
            }
        });
        this.clickedCell = cell;
        this.focusCell.Cell = this.clickedWords[0].cells[0];
        this.focusCell.Orientation = this.clickedWords[0].orientation;
    }

    public addHighlightOnFocus(cell: ICell): string {
        return this.focusCell.Cell === cell ? "focus" : "";
    }

    @HostListener("window:keydown", ["$event"])
    public onKeyDown(event: KeyboardEvent): void {
        this.keyboardInputManagerService.handleKeyDown(event);
    }
}
