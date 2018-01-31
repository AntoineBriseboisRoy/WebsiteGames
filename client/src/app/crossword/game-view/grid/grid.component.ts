import { Component, OnInit} from '@angular/core';
import { GridCaseComponent } from './grid-case/grid-case.component';
import {Word} from './word';
import { Position } from './position';

@Component({
  selector: 'crossword-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})

export class GridComponent implements OnInit {

  private wordArray: Array<Word>; 
  private caseNumber: number = 0;
  private currentPosition: Position=new Position(0,0);
  private width : number = 10; 
  // Mock list that we recieve from crossword generator
  private mot:string[]=["aaaaa", "**", "aaa","sadasd", "*", "asd",
                        "aaaaa", "**", "aaa","sadasd", "*", "asd", 
                        "aaaaa", "**", "aaa","sadasd", "*", "asd",
                        "aaaaa", "**", "aaa","sadasd", "*", "asd",
                        "aaaaa", "**", "aaa","sadasd", "*", "asd"];

  constructor() {
  }

  ngOnInit() {
    this.wordArray = new Array();
    for(let i : number = 0; i < this.mot.length; ++i){
      this.wordArray.push(new Word(i, this.currentPosition,this.mot[i]));
      this.currentPosition.update(this.mot[i].length, this.width);
    }
    
  }
  
  isABlackSquare(letter : string) : Boolean {
    return letter == '*';
  }
 
  getCaseType(letter: string): string {
    return this.isABlackSquare(letter) ? "black-square" : "white-square";
  }
/*
  setGrid(index: number, value: string) {
    this.grid[index].setValue(value);
  }*/

  incrementCaseNumber() {
    this.caseNumber++;
    return true;
  }
 
  show() {
    alert('allo');
  }
}
