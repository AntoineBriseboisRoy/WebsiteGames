import {OnInit } from '@angular/core';
import {Position} from './position'
export class Word implements OnInit {
    constructor(private id : number, private startPos : Position, private content : string) {
      //we could create a .ts for a cell and each letter represent a cell
    }
  
    ngOnInit() {
    }

    public getValue() : Array<string> {
      console.log(this.id);
      console.log(this.startPos);
      return this.content.split("");
    }

}