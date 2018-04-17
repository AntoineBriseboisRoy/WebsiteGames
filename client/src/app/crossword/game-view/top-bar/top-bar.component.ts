import { Component } from "@angular/core";
import { GameManagerService } from "../../game-manager.service";
import { Difficulty } from "../../../../../../common/constants";
import { DifficultyView } from "../../../constants";
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

    public difficultyToString(): string {
        switch (this.gameManager.difficulty) {
            case Difficulty.Easy: return DifficultyView.Easy;
            case Difficulty.Medium: return DifficultyView.Medium;
            case Difficulty.Hard: return DifficultyView.Hard;
            default: return "";
        }
    }
}
