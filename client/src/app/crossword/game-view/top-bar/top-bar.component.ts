import { Component, OnInit } from "@angular/core";
import { GameManager } from "../../game-manager";
import { PlayerInformationComponent } from "../player-information/player-information.component";

@Component({
  selector: "app-crossword-top-bar",
  templateUrl: "./top-bar.component.html",
  styleUrls: ["./top-bar.component.css"]
})
export class TopBarComponent implements OnInit {
  private gameManager: GameManager = GameManager.getInstance();
  private player: PlayerInformationComponent = new PlayerInformationComponent();

  public constructor() { }

  public ngOnInit(): void {
  }

  public modeToString(): string {
    return this.gameManager.isMultiplayer() ? "Two Players" : "Single Player";
  }
}
