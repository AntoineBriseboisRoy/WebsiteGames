import {OnInit } from '@angular/core';
import {Position} from './position'

export class Word implements OnInit {
    constructor(private id:number, private startPos: Position, private content:string) {
    }
  
    ngOnInit() {
      console.log(this.grid.push(new GridCaseComponent())); //= "";//new GridCaseComponent();// = i == 3 ? '*' : 'a';
    }

}