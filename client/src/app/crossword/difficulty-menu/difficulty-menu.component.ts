import { Component, OnInit } from "@angular/core";
import { GameManager } from "../game-manager";
import { Difficulty } from "../../constants";

@Component({
    selector: "app-crossword-difficulty-menu",
    templateUrl: "./difficulty-menu.component.html",
    styleUrls: ["./difficulty-menu.component.css", "../game-view/crossword-view.component.css"]
})
export class DifficultyMenuComponent implements OnInit {
    public readonly title: string = "Choose wisely your difficulty, smarty!";
    private gameManager: GameManager;
    private isActiveDifficulty: boolean;
    public constructor() {
        this.gameManager = GameManager.Instance;
        this.isActiveDifficulty = false;
    }

    public ngOnInit(): void {
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

    public activeDifficulty(difficulty: Difficulty): void {
        this.gameManager.setDifficulty(difficulty);
        this.isActiveDifficulty = true;
    }
}
