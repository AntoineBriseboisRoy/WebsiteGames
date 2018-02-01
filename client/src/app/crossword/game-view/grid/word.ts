import {OnInit } from '@angular/core';
import {Position} from './position';
import {Cell} from './cell';

export class Word implements OnInit {
    private cell: Array<Cell>;
    private cellHasId:boolean=true;
    constructor(private id : number, private startPos : Position, private content : string) {
      //we could create a .ts for a cell and each letter represent a cell
      this.cell = new Array();
      for(let i:number = 0;i<this.content.length; ++i){
        this.cell.push(new Cell(this.id,this.cellHasId,this.content[i]));
        this.cellHasId = false;
      }

    }
  
    ngOnInit() {
    }

    public getValue() : Array<string> {
      console.log(this.id);
      console.log(this.startPos);
      return this.content.split("");
    }

}