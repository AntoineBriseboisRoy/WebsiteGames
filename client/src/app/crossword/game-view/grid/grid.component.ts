import { Component, OnInit} from "@angular/core";
import {Word} from "./word";
import { Position } from "./position";
import {Cell} from "./cell";
import {BLACK_CHAR} from "../../../constants";

@Component({
  selector: "app-crossword-grid",
  templateUrl: "./grid.component.html",
  styleUrls: ["./grid.component.css"]
})

export class GridComponent implements OnInit {

  private wordArray: Array<Word> = new Array();
  private indexPosition: number[] = new Array();
  private currentPosition: Position = new Position(0, 0);
  private width: number = 10;
  private cellArray: Array<Cell> = new Array();
  // Mock list that we recieve from crossword generator
  private mot: string[]= ["aaa", BLACK_CHAR, "aa", BLACK_CHAR, "aa", BLACK_CHAR, "sadasd", BLACK_CHAR, "asd",
                          "aaaaaaa", BLACK_CHAR, "aa", "sadasd", BLACK_CHAR, "asd",
                          "aaaaaa", BLACK_CHAR, "aaa", "sadas", BLACK_CHAR, BLACK_CHAR, "asd",
                          "aaa", BLACK_CHAR, "aa", BLACK_CHAR, "aaa", "sadasd", BLACK_CHAR, "asd",
                          "aaaaaa", BLACK_CHAR, "aaa", "sadasd", BLACK_CHAR, "asd"];
  private wordChar: string;

  public constructor() {
  }

  public ngOnInit(): void {
    this.wordChar = this.mot[0];
    for (let i: number = 1; i < this.mot.length; ++i) {
      this.wordChar += this.mot[i];
    }
    this.createIndex();
    this.createCellArray();
    this.createWord();
  }

  private createCellArray(): void {
    let index: number = 1;
    for (let i: number = 0; i < this.wordChar.length; ++i) {
      if (i === this.indexPosition[index - 1]) {
        this.cellArray.push(new Cell(index, true, this.wordChar[i], false));
        ++index;
      } else {
        if (this.wordChar[i] === BLACK_CHAR) {
          this.cellArray.push(new Cell(i, false, this.wordChar[i], true));
        } else {
          this.cellArray.push(new Cell(i, false, this.wordChar[i], false));
        }
      }
    }
  }

  private lineJump(index: number): string {
    return (index % this.width) === 0 ? "square clear" : "square";
  }

  private isABlackSquare(letter: string): boolean {
    return letter === BLACK_CHAR;
  }

  private getCaseType(isBlack: boolean): string {
    return isBlack ? "black-square" : "white-square";
  }

  // create the array that contain every cell's number that need an index
  private createIndex(): void {
    for (let i: number = 0; i < this.wordChar.length; ++i) {
      if (this.containsIndex(i)) {
        this.indexPosition.push(i);
      }
    }
  }

  private containsIndex(i: number): boolean {
    const isBlack: boolean = this.isABlackSquare(this.wordChar[i]);

    return !isBlack &&
           (i < this.width ||                                    // first line
           this.isABlackSquare(this.wordChar[i - 1]) ||          // right side of a black square
           this.isABlackSquare(this.wordChar[i - this.width]) || // below a black square
           i % this.width === 0);                                // first column
  }
  // if we receive one big string
  private createWordChar(): void {
    for (let i: number = 0; i < this.wordChar.length; ++i) {
      if (this.isABlackSquare(this.wordChar[i])) {
        this.wordArray.push(new Word(i, this.currentPosition, this.mot[i]));
        this.currentPosition.update(this.mot[i].length, this.width);
      }
    }
  }
  // if we receive an array of string
  private createWord(): void {
    for (let i: number = 0; i < this.mot.length; ++i) {
      this.wordArray.push(new Word(i, this.currentPosition, this.mot[i]));
      this.currentPosition.update(this.mot[i].length, this.width);
    }
  }
}
