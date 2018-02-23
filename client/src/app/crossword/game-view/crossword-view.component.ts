import { Component, OnInit, HostListener } from "@angular/core";
import { KeywordInputManagerService } from "./keyword-input-manager/keyword-input-manager.service";

@Component({
    selector: "app-crossword-game-view",
    templateUrl: "./crossword-view.component.html",
    styleUrls: ["./crossword-view.component.css"],
    providers: [KeywordInputManagerService]
})
export class CrosswordViewComponent implements OnInit {

    public constructor(private keywordInputManagerService: KeywordInputManagerService) { }

    public ngOnInit(): void {
    }

    @HostListener("window:keydown", ["$event"])
    public onKeyDown(event: KeyboardEvent): void {
        this.keywordInputManagerService.handleKeyDown(event);
    }

}
