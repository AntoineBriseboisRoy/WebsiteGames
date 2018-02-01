import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'crossword-definition',
  templateUrl: './definition.component.html',
  styleUrls: ['./definition.component.css']
})
export class DefinitionComponent implements OnInit {
  private horizontalDefs: string[] = ["1. Lorem ipsum dolor sit amet, et", "2.  sea. Cu harum dolor fabellas", "3. Ea decore copiosae recusabo quo.", "666. vive angular"];
  private verticalDefs: string[] = ["1.  sea. Cu harum dolor fabellas", "2. Ea decore copiosae recusabo quo. ", "3. Lorem ipsum dolor sit amet, et", "666. vive angular"];
  constructor() { }

  ngOnInit() {
  }
 
  jsuisQui(value:any) {
    console.log(value);
  }
}
