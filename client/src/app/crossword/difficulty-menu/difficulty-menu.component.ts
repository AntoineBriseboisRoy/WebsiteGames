import { Component, OnInit } from "@angular/core";
import { GameManager } from "../game-manager";
import { Difficulty } from "../../constants";

@Component({
    selector: "app-crossword-difficulty-menu",
    templateUrl: "./difficulty-menu.component.html",
    styleUrls: ["./difficulty-menu.component.css", "../game-view/crossword-view.component.css"]
})
export class DifficultyMenuComponent implements OnInit {
    public readonly title: string = "Choose wisely your difficulty, smart ass!";
    private gameManager: GameManager;
    private isActiveDifficulty: boolean;
    public constructor() {
        this.gameManager = GameManager.getInstance();
        this.isActiveDifficulty = false;
    }

    public ngOnInit(): void {
    }

    public activeDifficulty(difficulty: Difficulty): void {
        this.gameManager.setDifficulty(difficulty);
        this.isActiveDifficulty = true;
        // faudrait que je toogle une classe active ou desactive
        switch (difficulty.toString()) {
            case "Difficulty.Easy": {
                document.getElementById("easy-button").style.backgroundColor = "green";
                document.getElementById("normal-button").style.backgroundColor = "white";
                document.getElementById("hard-button").style.backgroundColor = "white";
                break;
            }
            case "Difficulty.Normal": {
                document.getElementById("normal-button").style.backgroundColor = "yellow";
                document.getElementById("hard-button").style.backgroundColor = "white";
                document.getElementById("easy-button").style.backgroundColor = "white";
                break;
            }
            case "Difficulty.Hard": {
                document.getElementById("hard-button").style.backgroundColor = "red";
                document.getElementById("normal-button").style.backgroundColor = "white";
                document.getElementById("easy-button").style.backgroundColor = "white";
                break;
            }
            default: {
                break;
            }
        }
    }
}
