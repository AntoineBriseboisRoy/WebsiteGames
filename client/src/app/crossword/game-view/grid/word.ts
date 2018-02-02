import {OnInit } from '@angular/core';
import {Position} from './position';

export class Word implements OnInit {
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