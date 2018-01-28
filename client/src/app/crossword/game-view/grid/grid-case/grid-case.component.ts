import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'crossword-grid-case',
  templateUrl: './grid-case.component.html',
  styleUrls: ['./grid-case.component.css']
})
export class GridCaseComponent implements OnInit {
  index: number;
  value: string;
  constructor() {
    this.index = 0;
    this.value = "z";
  }
  

  setIndex(value: number) {
    this.index = value;
  }

  public setValue(value: string) {
    this.value = value;
  }

  getIndex(): number {
    return this.index;
  }

  getValue(): string {
    return this.value;
  }
  ngOnInit() {
   
  }

}
