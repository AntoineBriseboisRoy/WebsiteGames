import { Component } from "@angular/core";
import { GameManagerService } from "../../game-manager.service";

@Component({
    selector: "app-crossword-top-bar",
    templateUrl: "./top-bar.component.html",
    styleUrls: ["./top-bar.component.css"]
})
export class TopBarComponent {

    public constructor(private gameManager: GameManagerService) {
    }

    public modeToString(): string {
        return this.gameManager.isMultiplayer ? "Two Players" : "Single Player";
    }
}
