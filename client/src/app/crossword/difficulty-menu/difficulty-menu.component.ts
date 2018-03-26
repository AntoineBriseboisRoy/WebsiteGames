import { Component } from "@angular/core";
import { GameManager } from "../game-manager";
import { Difficulty } from "../../../../../common/constants";
import { SocketIoService } from "../socket-io.service";
import { Router } from "@angular/router";

@Component({
    selector: "app-crossword-difficulty-menu",
    templateUrl: "./difficulty-menu.component.html",
    styleUrls: ["./difficulty-menu.component.css", "../game-view/crossword-view.component.css"]
})
export class DifficultyMenuComponent {
    public readonly title: string = "Choose wisely your difficulty, smarty!";
    public isActiveDifficulty: boolean;

    public constructor(private socketIoService: SocketIoService, private router: Router) {
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

    public createGame(): void {
        this.socketIoService.PlayGameSubject.next({
            userCreator: "Claudia",
            difficulty: GameManager.Instance.difficulty,
            userCreatorID: "",
            userJoiner: ""
        });
        this.router.navigate(["/crossword/play"]);
    }
}
