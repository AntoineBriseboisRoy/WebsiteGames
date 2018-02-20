import { Component, OnInit } from "@angular/core";
import { Cell } from "./cell";
import { BLACK_CHAR, GRID_WIDTH } from "../../../constants";
import { GridWord } from "./gridWord";
// import {Grid} from "../../../../../../server/app/Grid/Grid";
// import {Word} from "../../../../../../server/app/Grid/Word";

@Component({
    selector: "app-crossword-grid",
    templateUrl: "./grid.component.html",
    styleUrls: ["./grid.component.css"]
})

export class GridComponent implements OnInit {
    private indexPosition: number[];
    private cells: Array<Cell>;
    private words: Array<GridWord>;
    // Mock list that we will receive from crossword generator
    private mockWords: string[];
    private convertedMockWords: string;
    public constructor() {// private grid: Grid) {
        this.indexPosition = new Array();
        this.cells = new Array();
        // Créer un service pour couche de persistance :
        this.mockWords = ["aaa", BLACK_CHAR, "aa", BLACK_CHAR, "aa", BLACK_CHAR, "sadasd", BLACK_CHAR, "asd",
                          "aaaaaaa", BLACK_CHAR, "aa", "sadasd", BLACK_CHAR, "asd",
                          "aaaaaa", BLACK_CHAR, "aaa", "sadas", BLACK_CHAR, BLACK_CHAR, "asd",
                          "aaa", BLACK_CHAR, "aa", BLACK_CHAR, "aaa", "sadasd", BLACK_CHAR, "asd",
                          "aaaaaa", BLACK_CHAR, "aaa", "sadasd", BLACK_CHAR, "asd"];
        this.createConvertedMockWords();
    }

    public ngOnInit(): void {
        // this.grid = ;
        this.createIndex();
        this.createCells();
        this.createWords();
    }

    private isABlackSquare(letter: string): boolean {
        return letter === BLACK_CHAR;
    }

    private createCells(): void {
        let index: number = 1;
        for (let i: number = 0; i < this.convertedMockWords.length; ++i) {
            if (i === this.indexPosition[index - 1]) {
                this.cells.push(new Cell(index, true, this.convertedMockWords[i], false));
                ++index;
            } else {
                if (this.convertedMockWords[i] === BLACK_CHAR) {
                    this.cells.push(new Cell(i, false, this.convertedMockWords[i], true));
                } else {
                    this.cells.push(new Cell(i, false, this.convertedMockWords[i], false));
                }
            }
        }
    }

    private createConvertedMockWords(): void {
        this.convertedMockWords = this.mockWords[0];
        for (let i: number = 1; i < this.mockWords.length; ++i) {
            this.convertedMockWords += this.mockWords[i];
        }
    }

    // create the array that contain every cell's number that need an index
    private createIndex(): void {
        for (let i: number = 0; i < this.convertedMockWords.length; ++i) {
            if (this.containsIndex(i)) {
                this.indexPosition.push(i);
            }
        }
    }

    private containsIndex(i: number): boolean {
        return !this.isABlackSquare(this.convertedMockWords[i]) &&              // the cell isn't black
                (i < GRID_WIDTH ||                                              // first line
                this.isABlackSquare(this.convertedMockWords[i - 1]) &&
                !this.isABlackSquare(this.convertedMockWords[i + 1]) ||          // right side of a black square
                this.isABlackSquare(this.convertedMockWords[i - GRID_WIDTH])
                && !this.isABlackSquare(this.convertedMockWords[i + GRID_WIDTH]) || // below a black square
                i % GRID_WIDTH === 0);                                          // first column
    }

    private createWords(): void {
        const mockCells: Array<Cell> = new Array();

        // this.grid.Words.forEach((word: Word, index: number) => {
        //     const startPosition: number = this.convertPositionToCellIndex(word.Position.X, word.Position.Y);
        //     if (!word.Orientation) {// Vertical
        //         for (let i: number = startPosition; i < word.Length; i = i + GRID_WIDTH) {
        //             mockCells.push(this.cells[i]);
        //         }
        //     } else {
        //         for (let i: number = startPosition; i < word.Length; i++) {
        //             mockCells.push(this.cells[i]);
        //         }
        //     }
        //     this.words.push(new GridWord(mockCells, word.Content, word.Definition, word.Orientation));
        // });
    }

    private convertPositionToCellIndex(x: number, y: number): number {
        return y * GRID_WIDTH + x;
    }

    private gridLineJump(index: number): string {
        return (index % GRID_WIDTH) === 0 ? "square clear" : "square";
    }

    private getCellType(isBlack: boolean): string {
        return isBlack ? "black-square" : "white-square";
    }
}
