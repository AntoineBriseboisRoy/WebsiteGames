import { Component, OnInit, HostListener } from "@angular/core";
import { GRID_WIDTH } from "../../../constants";
import { Orientation } from "../../../../../../common/constants";
import { IGridWord } from "../../../../../../common/interfaces/IGridWord";
import { ICell, CellColor, Finder } from "../../../../../../common/interfaces/ICell";
import { FocusCell } from "../focusCell";
import { KeyboardInputManagerService } from "../keyboard-input-manager/keyboard-input-manager.service";
import { GridService } from "../../grid.service";
import { SocketIoService } from "../../socket-io.service";

@Component({
    selector: "app-crossword-grid",
    templateUrl: "./grid.component.html",
    styleUrls: ["./grid.component.css"],
    providers: [KeyboardInputManagerService]
})

export class GridComponent implements OnInit {
    private clickedWords: Array<IGridWord>;
    private clickedCell: ICell;
    private focusCell: FocusCell;
    private keyboardInputManagerService: KeyboardInputManagerService;
    public constructor(private gridService: GridService, private socketIo: SocketIoService) {
        this.clickedWords = new Array();
        this.clickedCell = undefined;
        this.focusCell = FocusCell.Instance;
        this.keyboardInputManagerService = undefined;
    }

    public ngOnInit(): void {
        this.gridService.fetchGrid().subscribe(() =>
            this.keyboardInputManagerService = new KeyboardInputManagerService(this.gridService.gridCells)
        );
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
        return (this.clickedCell === cell && !cell.isFound && this.focusCell.cell !== undefined);
    }

    private addWordsToClickedWords(cell: ICell): void {
        this.clickedWords = [];
        this.gridService.gridWords.forEach((word: IGridWord) => {
            if (word.cells.includes(cell) && !word.isFound) {
                this.clickedWords.push(word);
            }
        });
    }

    private invertOrientation(): void {
        if (this.clickedWords.length > 1) {
            this.focusCell.cell = this.isFocusCellinCells(this.clickedWords[0].cells) ?
                this.clickedWords[1].cells[this.firstUnknownCell(this.clickedWords[1].cells)] :
                this.clickedWords[0].cells[this.firstUnknownCell(this.clickedWords[0].cells)];
            this.focusCell.cells = this.focusCell.cells === this.clickedWords[0].cells ?
                this.clickedWords[1].cells : this.clickedWords[0].cells;
            this.focusCell.invertOrientation();
        }
    }
    private chooseNewWord(cell: ICell): void {
        if (this.clickedWords.length !== 0) {
            this.clickedCell = cell;
            this.focusCell.cell = this.clickedWords[0].cells[this.firstUnknownCell(this.clickedWords[0].cells)];
            this.focusCell.cells = this.clickedWords[0].cells;
            this.focusCell.Orientation = this.clickedWords[0].orientation;
        } else {
            this.focusCell.clear();
        }
    }
    private isFocusCellinCells(cells: Array<ICell>): boolean {
        for (const cell of cells) {
            if (this.focusCell.cell === cell && this.focusCell.cells === cells) {
                return true;
            }
        }

        return false;
    }

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
                this.socketIo.CompletedWords.next(word);
            }
            userAnswer = "";
        }
    }

    private setCellsToFound(word: IGridWord): void {
        if (FocusCell.Instance.cells === word.cells) {
            FocusCell.Instance.clear();
        }
    }

    public gridLineJump(index: number): string {
        return (index % GRID_WIDTH) === 0 ? "square clear" : "square";
    }

    public getCellType(color: CellColor): string {
        return color === CellColor.Black ? "black-square" : "white-square";
    }
    public addHighlightOnFocus(cell: ICell): string {
        return this.focusCell.cell === cell ? "focus" : "";
    }

    public addOrientationBorders(cell: ICell): string {
        if (this.focusCell.cells) {
            if (this.focusCell.cells.includes(cell)) {
                return this.focusCell.Orientation === Orientation.Vertical ?
                    "vertical-border" : "horizontal-border";
            }
        }

        return "";
    }

    public addFirstCellBorder(cell: ICell): string {
        if (this.focusCell.cells) {
            if (this.focusCell.cells[0] === cell) {
                return this.focusCell.Orientation === Orientation.Vertical ?
                    "first-case-border-vertical" : "first-case-border-horizontal";
            }
        }

        return "";
    }

    public addLastCellBorder(cell: ICell): string {
        if (this.focusCell.cells) {
            if (this.focusCell.cells[this.focusCell.cells.length - 1] === cell) {
                return this.focusCell.Orientation === Orientation.Vertical ?
                    "last-case-border-vertical" : "last-case-border-horizontal";
            }
        }

        return "";
    }

    public addStyleOnFoundWord(cell: ICell): string {
        if (cell.isFound) {
            if ( cell.finder === Finder.player1 ) {
                return "isFoundCellPlayerOne";
            } else if ( cell.finder === Finder.player2 ) {
                return "isFoundCellPlayerTwo";
            } else if ( cell.finder === Finder.both ) {
                return "isFoundCellBoth";
            }
        }

        return "";
    }

    @HostListener("window:keydown", ["$event"])
    public onKeyDown(event: KeyboardEvent): void {
        const cell: ICell = this.focusCell.cell;
        this.keyboardInputManagerService.handleKeyDown(event.keyCode);
        this.verifyAnswers(cell);
    }
}
