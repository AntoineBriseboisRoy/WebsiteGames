import { Component, OnInit } from "@angular/core";
import { GameManager } from "../../game-manager";

@Component({
    selector: "app-crossword-top-bar",
    templateUrl: "./top-bar.component.html",
    styleUrls: ["./top-bar.component.css"]
})
export class TopBarComponent implements OnInit {
    private gameManager: GameManager = GameManager.getInstance();

    public constructor() { }

    public ngOnInit(): void {
    }

    public modeToString(): string {
        return this.gameManager.isMultiplayer() ? "Two Players" : "Single Player";
    }
}
