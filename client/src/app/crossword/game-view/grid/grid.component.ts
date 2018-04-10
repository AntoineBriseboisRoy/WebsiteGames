import { Component, OnInit, HostListener } from "@angular/core";
import { GRID_WIDTH } from "../../../constants";
import { IGridWord } from "../../../../../../common/interfaces/IGridWord";
import { ICell, CellColor, Finder } from "../../../../../../common/interfaces/ICell";
import { FocusCell } from "../focusCell";
import { KeyboardInputManagerService } from "../keyboard-input-manager/keyboard-input-manager.service";
import { GridService } from "../../grid.service";
import { SocketIoService } from "../../socket-io.service";
import { SelectionHandlerService } from "./selection-handler.service";

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
    public constructor(private gridService: GridService, private socketIo: SocketIoService,
                       public selectionHandler: SelectionHandlerService) {
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
            const selectedWord: IGridWord =  this.focusCell.cells === this.clickedWords[0].cells ?
                                this.clickedWords[1] : this.clickedWords[0];
            this.focusCell.cells = selectedWord.cells;
            this.focusCell.invertOrientation();
            this.socketIo.SelectedWordsSubject.next([selectedWord]);
        }
    }
    private chooseNewWord(cell: ICell): void {
        if (this.clickedWords.length !== 0) {
            this.clickedCell = cell;
            this.focusCell.cell = this.clickedWords[0].cells[this.firstUnknownCell(this.clickedWords[0].cells)];
            this.focusCell.cells = this.clickedWords[0].cells;
            this.focusCell.Orientation = this.clickedWords[0].orientation;
            this.socketIo.SelectedWordsSubject.next([this.clickedWords[0]]);
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

    public addStyleOnFoundWord(cell: ICell): string {
        if (cell.isFound) {
            if ( cell.finder === Finder.player1 ) {
                return "is-found-cell-p1";
            } else if ( cell.finder === Finder.player2 ) {
                return "is-found-cell-p2";
            } else if ( cell.finder === Finder.both ) {
                return "is-found-cell-both";
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
