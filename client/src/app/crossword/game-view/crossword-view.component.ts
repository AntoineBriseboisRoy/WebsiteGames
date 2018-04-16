import { Component } from "@angular/core";
import { FocusCell } from "./focusCell";
import { EndGameService } from "../end-game.service";

@Component({
    selector: "app-crossword-game-view",
    templateUrl: "./crossword-view.component.html",
    styleUrls: ["./crossword-view.component.css"]
})
export class CrosswordViewComponent {

    public constructor(private endGameService: EndGameService) {
        this.endGameService.initSubscriptions();
    }
    public clickHandler(event: Event): void {
        if (this.isOutsideClick(event)) {
            FocusCell.Instance.clear();
        }
    }

    private isOutsideClick(event: Event): boolean {
        return event.srcElement.closest(".definition-for-click") === null &&
               event.srcElement.closest(".cell-for-click") === null;
    }
}
