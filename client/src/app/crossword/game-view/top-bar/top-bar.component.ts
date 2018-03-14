import { Component } from "@angular/core";
import { GameManager } from "../../game-manager";

@Component({
    selector: "app-crossword-top-bar",
    templateUrl: "./top-bar.component.html",
    styleUrls: ["./top-bar.component.css"]
})
export class TopBarComponent {
    private gameManager: GameManager;

    public constructor() {
        this.gameManager = GameManager.Instance;
    }

    public modeToString(): string {
        return this.gameManager.IsMultiplayer ? "Two Players" : "Single Player";
    }
}
