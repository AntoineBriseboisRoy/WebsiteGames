import { Component, OnInit } from "@angular/core";
import { FocusCell } from "./focusCell";

@Component({
    selector: "app-crossword-game-view",
    templateUrl: "./crossword-view.component.html",
    styleUrls: ["./crossword-view.component.css"],
})
export class CrosswordViewComponent implements OnInit {

    public constructor() { }

    public ngOnInit(): void {
    }

    public clickHandler(event: Event): void {
        if (this.isOutsideClick(event)) {
            FocusCell.Instance.Cell = undefined;
            FocusCell.Instance.Orientation = undefined;
        }
    }

    private isOutsideClick(event: Event): boolean {
        return event.srcElement.closest(".definition-for-click") === null &&
               event.srcElement.closest(".cell-for-click") === null;
    }
}
