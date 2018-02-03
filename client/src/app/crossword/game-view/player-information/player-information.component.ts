import { Component, OnInit } from "@angular/core";
import { Player } from "../../player";

@Component({
  selector: "crossword-player-information",
  templateUrl: "./player-information.component.html",
  styleUrls: ["./player-information.component.css"]
})
export class PlayerInformationComponent implements OnInit {

  public playerOne: Player = {
    name: "Claudia",
    point: 0
  };
  public playerTwo: Player = {
    name: "Antoine",
    point: 100
  };
  public multiplayer: boolean = false;

  public constructor() { }

  public ngOnInit(): void {
  }

}
