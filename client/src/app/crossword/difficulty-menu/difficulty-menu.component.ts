import { Component } from "@angular/core";
import { GameManager } from "../game-manager";
import { Difficulty } from "../../constants";

@Component({
    selector: "app-crossword-difficulty-menu",
    templateUrl: "./difficulty-menu.component.html",
    styleUrls: ["./difficulty-menu.component.css", "../game-view/crossword-view.component.css"]
})
export class DifficultyMenuComponent {
    public readonly title: string = "Choose wisely your difficulty, smarty!";
    public isActiveDifficulty: boolean;

    private gameManager: GameManager;

    public constructor() {
        this.gameManager = GameManager.Instance;
        this.isActiveDifficulty = false;
    }

    public onButtonGroupClick($event: Event): void {
        const clickedElement: Element = $event.srcElement;
        if (clickedElement.nodeName === "BUTTON") {
            const isButtonAlreadyActive: Element = clickedElement.parentElement.parentElement.querySelector(".active");
            // if a Button already has Class: .active
            if (isButtonAlreadyActive) {
                isButtonAlreadyActive.classList.remove("active");
            }
            clickedElement.className += " active";
        }
    }

    public activateDifficulty(difficulty: Difficulty): void {
        GameManager.Instance.difficulty = difficulty;
        this.isActiveDifficulty = true;
    }
}
