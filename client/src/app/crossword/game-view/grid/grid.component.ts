import { Component, OnInit, HostListener } from "@angular/core";
import { GRID_WIDTH, Orientation } from "../../../constants";

import { IGridWord } from "../../interfaces/IGridWord";
import { ICell, CellColor } from "../../interfaces/ICell";
import { FocusCell } from "../focusCell";
import { KeyboardInputManagerService } from "../keyboard-input-manager/keyboard-input-manager.service";
import { WordTransmitterService } from "../wordTransmitter.service";
import { IWord } from "../../../../../../common/interfaces/IWord";
import { GameManager } from "../../game-manager";

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
        this.gridWords = new Array();
        this.clickedWords = new Array();
        this.focusCell = FocusCell.Instance;
    }

    public ngOnInit(): void {
        this.wordTransmitterService.getTransformedWords().subscribe((gridWords: Array<IGridWord>) => {
            this.gridWords = gridWords;
        });
        this.wordTransmitterService.getCells().subscribe((gridCells: Array<ICell>) => {
            this.cells = gridCells;
            this.keyboardInputManagerService = new KeyboardInputManagerService(this.cells);
        });
    }

    public focusOnCell(cell: ICell): void {
        this.addWordsToClickedWords(cell);
         // if click on the same cell twice, switch to Vertical/Horizontal word
        if (this.clickedCell === cell && cell.isFound === false && this.focusCell.Cell !== undefined) {
            this.chooseHorizontalOrVertical();
        } else {
            this.chooseNewWords(cell);
        }
    }

    private addWordsToClickedWords(cell: ICell): void {
        this.clickedWords = [];
        this.gridWords.forEach((word: IGridWord) => {
            if (word.cells.includes(cell) && !word.isFound) {
                this.clickedWords.push(word);
            }
        });
    }

    private chooseHorizontalOrVertical(): void {
        if (this.clickedWords.length > 1) {
            this.focusCell.Cell = this.isFocusCellinCells(this.clickedWords[0].cells) ?
                this.clickedWords[1].cells[this.firstUnknownCell(this.clickedWords[1].cells)] :
                this.clickedWords[0].cells[this.firstUnknownCell(this.clickedWords[0].cells)];
            this.focusCell.Cells = this.focusCell.Cells === this.clickedWords[0].cells ?
                this.clickedWords[1].cells : this.clickedWords[0].cells;
            this.focusCell.invertOrientation();
        }
    }
    private chooseNewWords(cell: ICell): void {
        if (this.clickedWords.length !== 0) {
            this.clickedCell = cell;
            this.focusCell.Cell = this.clickedWords[0].cells[this.firstUnknownCell(this.clickedWords[0].cells)];
            this.focusCell.Cells = this.clickedWords[0].cells;
            this.focusCell.Orientation = this.clickedWords[0].orientation;
        } else {
            this.focusCell.clear();
        }
    }
    private isFocusCellinCells(cells: Array<ICell>): boolean {
        for (const cell of cells) {
            if (this.focusCell.Cell === cell && this.focusCell.Cells === cells) {
                return true;
            }
        }

        return false;
    }

    // Focus on the first unfound cell of an unfound word.
    private firstUnknownCell(cells: Array<ICell>): number {
        for (let i: number = 0; i < cells.length; i++) {
            if (!cells[i].isFound) {
                return i;
            }
        }

        return -1;
    }

    private verifyAnswers(focusCell: ICell): void {
        let userAnswer: string = "";
        let correctAnswer: string = "";

        this.addWordsToClickedWords(focusCell);

        for (const word of this.clickedWords) {
            correctAnswer = word.correctAnswer;
            for (const cell of word.cells) {
                userAnswer += cell.content;
            }
            if (userAnswer === correctAnswer) {
                this.setCellsToFound(word);
                GameManager.Instance.PlayerOne.addPoint(word.cells.length);
                word.isFound = true;
            }
            userAnswer = "";
        }
    }

    private setCellsToFound(word: IGridWord): void {
        word.cells.forEach((cell) => {
            cell.isFound = true;
        });
        if (FocusCell.Instance.Cells === word.cells) {
            FocusCell.Instance.clear();
        }
    }

    /* Fonctions appeler directement par le html: */
    public gridLineJump(index: number): string {
        return (index % GRID_WIDTH) === 0 ? "square clear" : "square";
    }

    public getCellType(color: CellColor): string {
        return color === CellColor.Black ? "black-square" : "white-square";
    }
    public addHighlightOnFocus(cell: ICell): string {
        return this.focusCell.Cell === cell ? "focus" : "";
    }

    public addOrientationBorders(cell: ICell): string {
        if (this.focusCell.Cells) {
            if (this.focusCell.Cells.includes(cell)) {
                return this.focusCell.Orientation === Orientation.Vertical ?
                    "vertical-border" : "horizontal-border";
            }
        }

        return "";
    }

    public addFirstCellBorder(cell: ICell): string {
        if (this.focusCell.Cells) {
            if (this.focusCell.Cells[0] === cell) {
                return this.focusCell.Orientation === Orientation.Vertical ?
                    "first-case-border-vertical" : "first-case-border-horizontal";
            }
        }

        return "";
    }

    public addLastCellBorder(cell: ICell): string {
        if (this.focusCell.Cells) {
            if (this.focusCell.Cells[this.focusCell.Cells.length - 1] === cell) {
                return this.focusCell.Orientation === Orientation.Vertical ?
                    "last-case-border-vertical" : "last-case-border-horizontal";
            }
        }

        return "";
    }

    public addStyleOnFoundWord(cell: ICell): string {
        return cell.isFound ? "isFoundCell" : "";
    }

    @HostListener("window:keydown", ["$event"])
    public onKeyDown(event: KeyboardEvent): void {
        const cell: ICell = this.focusCell.Cell;
        this.keyboardInputManagerService.handleKeyDown(event.keyCode);
        this.verifyAnswers(cell);
    }
}
