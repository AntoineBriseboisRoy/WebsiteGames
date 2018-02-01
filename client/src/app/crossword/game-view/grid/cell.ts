import {OnInit } from '@angular/core';

export class Cell implements OnInit {
    constructor(private id : number, private hasId : boolean, private content : string) {
    }
  
    ngOnInit() {
    }

    public getValue() : Array<string> {
      console.log(this.id);
      return this.content.split("");
    }

}