import { Component, OnInit } from "@angular/core";
import { Cell } from "./cell";
import { BLACK_CHAR, GRID_WIDTH } from "../../../constants";
import { GridWord } from "./gridWord";

import { GridService } from "../../grid.service";
import { IWord } from "../../../../../../common/Word";

@Component({
    selector: "app-crossword-grid",
    templateUrl: "./grid.component.html",
    styleUrls: ["./grid.component.css"]
})

export class GridComponent implements OnInit {
    private indexPosition: number[];
    private cells: Array<Cell>;
    private gridWords: Array<GridWord>;
    // Mock list that we will receive from crossword generator
    private mockWords: string[];
    // private convertedMockWords: string;
    private gridContent: string;
    private words: Array<IWord>;

    public constructor(private gridService: GridService) {
        this.indexPosition = new Array();
        this.cells = new Array();
        this.gridWords = new Array<GridWord>();
        // Créer un service pour couche de persistance :
        // this.mockWords = ["aaa", BLACK_CHAR, "aa", BLACK_CHAR, "aa", BLACK_CHAR, "sadasd", BLACK_CHAR, "asd",
        //                   "aaaaaaa", BLACK_CHAR, "aa", "sadasd", BLACK_CHAR, "asd",
        //                   "aaaaaa", BLACK_CHAR, "aaa", "sadas", BLACK_CHAR, BLACK_CHAR, "asd",
        //                   "aaa", BLACK_CHAR, "aa", BLACK_CHAR, "aaa", "sadasd", BLACK_CHAR, "asd",
        //                   "aaaaaa", BLACK_CHAR, "aaa", "sadasd", BLACK_CHAR, "asd"];
        // this.createConvertedMockWords();
    }

    public ngOnInit(): void {
        this.gridService.getGrid().subscribe((gridContent: string) => {
            this.gridContent = gridContent;
        });
        this.gridService.getWords().subscribe((words: Array<IWord>) => {
            this.words = words;
            this.createIndex();
            this.createCells();
            this.createWords();
        });
    }

    private isABlackSquare(letter: string): boolean {
        return letter === BLACK_CHAR;
    }

    private createCells(): void {
        let index: number = 1;
        for (let i: number = 0; i < this.gridContent.length; ++i) {
            if (i === this.indexPosition[index - 1]) {
                this.cells.push(new Cell(index, true, this.gridContent[i], false));
                ++index;
            } else {
                if (this.gridContent[i] === BLACK_CHAR) {
                    this.cells.push(new Cell(i, false, this.gridContent[i], true));
                } else {
                    this.cells.push(new Cell(i, false, this.gridContent[i], false));
                }
            }
        }
    }

    // private createConvertedMockWords(): void {
    //     this.convertedMockWords = this.mockWords[0];
    //     for (let i: number = 1; i < this.mockWords.length; ++i) {
    //         this.convertedMockWords += this.mockWords[i];
    //     }
    // }

    // create the array that contain every cell's number that need an index
    private createIndex(): void {
        for (let i: number = 0; i < this.gridContent.length; ++i) {
            if (this.containsIndex(i)) {
                this.indexPosition.push(i);
            }
        }
    }

    private containsIndex(i: number): boolean {
        return !this.isABlackSquare(this.gridContent[i]) &&              // the cell isn't black
            (i < GRID_WIDTH ||                                              // first line
                this.isABlackSquare(this.gridContent[i - 1]) &&
                !this.isABlackSquare(this.gridContent[i + 1]) ||          // right side of a black square
                this.isABlackSquare(this.gridContent[i - GRID_WIDTH])
                && !this.isABlackSquare(this.gridContent[i + GRID_WIDTH]) || // below a black square
                i % GRID_WIDTH === 0);                                          // first column
    }

    private createWords(): void {
        let mockCells: Array<Cell> = new Array();
        this.words.forEach((word: IWord, index: number) => {
            const startPosition: number = this.convertPositionToCellIndex(word.position.x, word.position.y);
            if (word.orientation === 0) { // Vertical
                for (let i: number = startPosition, j: number = 0; j < word.content.length; i = i + GRID_WIDTH, j++) {
                    mockCells.push(this.cells[i]);
                }
            } else {
                for (let i: number = startPosition; i < word.content.length + startPosition; i++) {
                    mockCells.push(this.cells[i]);
                }
            }
            this.gridWords.push(new GridWord(mockCells, word.content, word.definition, word.orientation));
            mockCells = [];
        });
    }

    private convertPositionToCellIndex(x: number, y: number): number {
        return (y * GRID_WIDTH + x);
    }

    private gridLineJump(index: number): string {
        return (index % GRID_WIDTH) === 0 ? "square clear" : "square";
    }

    private getCellType(isBlack: boolean): string {
        return isBlack ? "black-square" : "white-square";
    }
}
