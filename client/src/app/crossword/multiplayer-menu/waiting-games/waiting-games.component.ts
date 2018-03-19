import { Component } from "@angular/core";
import { MultiplayerGamesService } from "../multiplayer-games.service";

@Component({
  selector: "app-waiting-games",
  templateUrl: "./waiting-games.component.html",
  styleUrls: ["./waiting-games.component.css"]
})
export class WaitingGamesComponent {

  public constructor(public waitingGames: MultiplayerGamesService) { }

}
