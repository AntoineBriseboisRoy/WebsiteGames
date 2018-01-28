import { Component, OnInit} from '@angular/core';
import { GRID_WIDTH } from '../../../constants';
import { GridCaseComponent } from './grid-case/grid-case.component'

@Component({
  selector: 'crossword-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})

export class GridComponent implements OnInit {

  private grid: Array<GridCaseComponent> = new Array(GRID_WIDTH * GRID_WIDTH); // = ["a","a","a","a","a","a","a"];
  caseNumber: number = 0;
  constructor() {
    
  }
  
  setGrid(index: number, value: string) {
    this.grid[index].value = value;
  }

  ngOnInit() {
    for (let i:number = 0; i < GRID_WIDTH * GRID_WIDTH; i++) {
      this.grid[i] = new GridCaseComponent();// = i == 3 ? '*' : 'a';
    }
  
    //this.grid[0].value = "a";
  }

  incrementCaseNumber() {
    this.caseNumber++;
  }

  changesd() {
    this.grid[50].setValue("a");
  }
  show() {
    alert('allo');
    this.changesd();
  }
}
