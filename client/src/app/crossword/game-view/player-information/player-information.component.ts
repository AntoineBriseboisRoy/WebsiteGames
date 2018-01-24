import { Component, OnInit } from '@angular/core';
import { Player } from "../../player"

@Component({
  selector: 'app-player-information',
  templateUrl: './player-information.component.html',
  styleUrls: ['./player-information.component.css']
})
export class PlayerInformationComponent implements OnInit {

  player: Player = {
    name: "",
    point: 0
  };
  constructor() { }

  ngOnInit() {
  }

}
