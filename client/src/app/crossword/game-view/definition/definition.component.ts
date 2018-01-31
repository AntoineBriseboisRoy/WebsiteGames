import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'crossword-definition',
  templateUrl: './definition.component.html',
  styleUrls: ['./definition.component.css']
})
export class DefinitionComponent implements OnInit {
  private def: string[] = ["allo", "fuck", "ca suffit", "vive angular"];
  constructor() { }

  ngOnInit() {
    this.def[2] = "heyyy";
  }
 
  jsuisQui(value:any) {
    console.log(value);
  }
}
