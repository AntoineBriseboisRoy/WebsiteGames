import {OnInit } from '@angular/core';
import {Position} from './position';
import {Cell} from './cell';

export class Word implements OnInit {
    private cell: Array<Cell>;
    private cellHasId:boolean=true;
    constructor(private id : number, private startPos : Position, private content : string) {
      }

    
  
    ngOnInit() {
    }

    public getValue() : Array<string> {
      console.log(this.id);
      console.log(this.startPos);
      return this.content.split("");
    }

}