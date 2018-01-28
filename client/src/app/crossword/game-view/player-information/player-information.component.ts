import { Component, OnInit } from '@angular/core';
import { Player } from "../../player"

@Component({
  selector: 'crossword-player-information',
  templateUrl: './player-information.component.html',
  styleUrls: ['./player-information.component.css']
})
export class PlayerInformationComponent implements OnInit {

  player: Player = {
    name: "Claudia",
    point: 0
  };
  multiplayer: boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
