import { Component, OnInit, HostListener } from "@angular/core";
import { GRID_WIDTH, Orientation } from "../../../constants";

import { IGridWord } from "../../interfaces/IGridWord";
import { ICell, CellColor } from "../../interfaces/ICell";
import { FocusCell } from "../focusCell";
import { KeyboardInputManagerService } from "../keyboard-input-manager/keyboard-input-manager.service";
import { WordTransmitterService } from "../wordTransmitter.service";
import { GameManager } from "../../game-manager";
import { ModalService } from "../../../modal/modal.service";
import { Router } from "@angular/router";

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
    public constructor(private wordTransmitterService: WordTransmitterService, private modalService: ModalService, private router: Router) {
        this.cells = new Array();
        this.gridWords = new Array();
        this.clickedWords = new Array();
        this.clickedCell = undefined;
        this.focusCell = FocusCell.Instance;
        this.keyboardInputManagerService = undefined;
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
        if (this.isSameCell(cell)) {
            this.invertOrientation();
        } else {
            this.chooseNewWord(cell);
        }
    }

    private isSameCell(cell: ICell): boolean {
        return (this.clickedCell === cell && !cell.isFound && this.focusCell.Cell !== undefined);
    }

    private addWordsToClickedWords(cell: ICell): void {
        this.clickedWords = [];
        this.gridWords.forEach((word: IGridWord) => {
            if (word.cells.includes(cell) && !word.isFound) {
                this.clickedWords.push(word);
            }
        });
    }

    private invertOrientation(): void {
        if (this.clickedWords.length > 1) {
            this.focusCell.Cell = this.isFocusCellinCells(this.clickedWords[0].cells) ?
                this.clickedWords[1].cells[this.firstUnknownCell(this.clickedWords[1].cells)] :
                this.clickedWords[0].cells[this.firstUnknownCell(this.clickedWords[0].cells)];
            this.focusCell.Cells = this.focusCell.Cells === this.clickedWords[0].cells ?
                this.clickedWords[1].cells : this.clickedWords[0].cells;
            this.focusCell.invertOrientation();
        }
    }
    private chooseNewWord(cell: ICell): void {
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

    // Return index of the first unfound cell of an unfound word.
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
                GameManager.Instance.playerOne.addPoint(word.cells.length);
                word.isFound = true;
            }
            userAnswer = "";
        }
    }

    private isGridCompleted(): boolean {
        for (const word of this.gridWords) {
            if (!word.isFound) {
                return false;
            }
        }

        return true;
    }

    private setCellsToFound(word: IGridWord): void {
        word.cells.forEach((cell) => {
            cell.isFound = true;
        });
        if (FocusCell.Instance.Cells === word.cells) {
            FocusCell.Instance.clear();
        }
    }

    /* Functions directly called by html: */
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
        if (this.isGridCompleted()) {
            this.modalService.open({
                title: "Game Over!", message: "Your score is " + GameManager.Instance.playerOne.point +
                    "! You can choose to replay or go back to home page",
                firstButton: "Restart", secondButton: "Home", showPreview: false
            })
                .then(() => this.router.navigate(["/crossword"]),
                      () => window.location.reload()
                );
        }
    }
}
