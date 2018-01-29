import { Component, OnInit} from '@angular/core';
import { GRID_WIDTH } from '../../../constants';
import { GridCaseComponent } from './grid-case/grid-case.component'

@Component({
  selector: 'crossword-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})

export class GridComponent implements OnInit {

  //private grid: Array<GridCaseComponent> = new Array(GRID_WIDTH * GRID_WIDTH); // = ["a","a","a","a","a","a","a"];
  private grid: string[] = new Array(GRID_WIDTH * GRID_WIDTH);
  caseNumber: number = 0;
  constructor() {
  }

  ngOnInit() {
    for (let i:number = 0; i < GRID_WIDTH * GRID_WIDTH; i++) {
      this.grid[i] = "";//new GridCaseComponent();// = i == 3 ? '*' : 'a';
    }
  
    this.grid[0] = "*";
    this.grid[4] = "A";
  }
  
  isABlackSquare(letter : string) : Boolean {
    return letter == '*';
  }

  getCaseType(letter : string) : string {
    return this.isABlackSquare(letter) ? "black-square" : "white-square";
  }

  setGrid(index: number, value: string) {
    this.grid[index] = value;
  }

  incrementCaseNumber() {
    this.caseNumber++;
  }
 
  show() {
    alert('allo');
  }
}
