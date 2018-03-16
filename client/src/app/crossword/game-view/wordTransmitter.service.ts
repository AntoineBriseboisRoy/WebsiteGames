import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { IGridWord } from "../interfaces/IGridWord";
import { IWord, Orientation } from "../../../../../common/interfaces/IWord";

import { GridService } from "../grid.service";
import { ICell, CellColor } from "../interfaces/ICell";
import { GRID_WIDTH, BLACK_CHAR } from "../../constants";
import { Observer } from "rxjs/Observer";

@Injectable()
export class WordTransmitterService {

    private indexPosition: number[];
    private cells: Array<ICell>;
    private gridWords: Array<IGridWord>;
    private gridContent: string;
    private words: Array<IWord>;

    public constructor(private gridService: GridService) {
        this.indexPosition = new Array();
        this.cells = new Array();
        this.gridWords = new Array<IGridWord>();
        this.gridService.getGrid().subscribe((gridContent: string) => {
            this.gridContent = gridContent;
        });
    }

    public getTransformedWords(): Observable<Array<IGridWord>> {
        return Observable.create((observer: Observer<Array<IGridWord>>) => {
            if (this.words === undefined) {
                this.gridService.getWords().subscribe((words: Array<IWord>) => {
                    this.words = words;
                    if (this.gridWords.length === 0) {
                        this.addIndextoCells();
                        this.createCells();
                        this.createWords();
                    }
                    observer.next(this.gridWords);
                });
            } else {
                observer.next(this.gridWords);
            }
        });
    }

    public getCells(): Observable<Array<ICell>> {
        return Observable.create((observer: Observer<Array<ICell>>) => {
            if (this.words === undefined) {
                this.getTransformedWords().subscribe((_) => {
                    observer.next(this.cells);
                });
            } else {
                observer.next(this.cells);
            }
        });
    }

    private isABlackSquare(letter: string): boolean {
        return letter === BLACK_CHAR;
    }

    private createCells(): void {
        let index: number = 1;
        for (let i: number = 0; i < this.gridContent.length; ++i) {
            if (i === this.indexPosition[index - 1]) {
                this.cells.push({
                    gridIndex: i, index: index, answer: this.gridContent[i],
                    cellColor: CellColor.White, content: "", isFound: false
                } as ICell);
                ++index;
            } else {
                if (this.gridContent[i] === BLACK_CHAR) {
                    this.cells.push({
                        gridIndex: i, index: null, answer: "",
                        cellColor: CellColor.Black, content: "", isFound: false
                    } as ICell);
                } else {
                    this.cells.push({
                        gridIndex: i, index: null, answer: this.gridContent[i],
                        cellColor: CellColor.White, content: "", isFound: false
                    } as ICell);
                }
            }
        }
    }

    // create the array that contain every cell's number that need an index
    private addIndextoCells(): void {
        for (let i: number = 0; i < this.gridContent.length; ++i) {
            if (this.containsIndex(i)) {
                this.indexPosition.push(i);
            }
        }
    }

    private containsIndex(i: number): boolean {
        return !this.isABlackSquare(this.gridContent[i]) &&
               (this.isFirstLineIndex(i) ||
                this.isRightToBlackSquare(i) ||
                this.isBelowBlackSquare(i) ||
                this.isFirstColumnIndex(i));
    }

    private isFirstLineIndex(i: number): boolean {
        return i < GRID_WIDTH && !this.isABlackSquare(this.gridContent[i + GRID_WIDTH]);
    }

    private isRightToBlackSquare(i: number): boolean {
        return this.isABlackSquare(this.gridContent[i - 1]) && !this.isABlackSquare(this.gridContent[i + 1]);
    }

    private isBelowBlackSquare(i: number): boolean {
        return this.isABlackSquare(this.gridContent[i - GRID_WIDTH]) &&
               !this.isABlackSquare(this.gridContent[i + GRID_WIDTH]) &&
               i < GRID_WIDTH * GRID_WIDTH - GRID_WIDTH;
    }

    private isFirstColumnIndex(i: number): boolean {
        return i % GRID_WIDTH === 0 && !this.isABlackSquare(this.gridContent[i + 1]);
    }

    private createWords(): void {
        let mockCells: Array<ICell> = new Array();
        this.words.forEach((word: IWord, index: number) => {
            const startPosition: number = this.convertPositionToCellIndex(word.position.x, word.position.y);
            if (word.orientation === Orientation.Vertical) {
                for (let i: number = startPosition, j: number = 0; j < word.content.length; i = i + GRID_WIDTH, j++) {
                    mockCells.push(this.cells[i]);
                }
            } else {
                for (let i: number = startPosition; i < word.content.length + startPosition; i++) {
                    mockCells.push(this.cells[i]);
                }
            }
            this.gridWords.push({
                cells: mockCells, correctAnswer: word.content,
                definition: word.definition, orientation: word.orientation, isFound: false
            } as IGridWord);
            mockCells = [];
        });
    }

    private convertPositionToCellIndex(x: number, y: number): number {
        return (y * GRID_WIDTH + x);
    }
}
