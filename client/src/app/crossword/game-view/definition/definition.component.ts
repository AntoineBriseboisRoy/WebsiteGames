import { Component, OnInit } from "@angular/core";
import {NO_CHEAT_COLOR, CHEAT_COLOR} from "../../../constants";

@Component({
    selector: "app-crossword-definition",
    templateUrl: "./definition.component.html",
    styleUrls: ["./definition.component.css"]
})

export class DefinitionComponent implements OnInit {
    public readonly horizontalDefinitions: string[];
    public readonly verticalDefinitions: string[];
    public readonly mockCheatModeWordsVertical: string[];
    public readonly mockCheatModeWordsHorizontal: string[];
    private cheatButtonColor: string;
    public cheatModeActive: boolean;
    public constructor() {
        this.horizontalDefinitions = ["Lorem ipsum dolor sit amet, et",
                                      "sea. Cu harum dolor fabellas",
                                      "Ea decore copiosae recusabo quo."];
        this.verticalDefinitions = ["sea. Cu harum dolor fabellas",
                                    "Ea decore copiosae recusabo quo. ",
                                    "Lorem ipsum dolor sit amet, et"];
        this.mockCheatModeWordsHorizontal = ["spit", "on", "him"];
        this.mockCheatModeWordsVertical = ["show", "me", "de", "wae"];
        this.cheatModeActive = false;
        this.cheatButtonColor = NO_CHEAT_COLOR;
    }

    public ngOnInit(): void {
        document.getElementById("cheat-button").style.backgroundColor = this.cheatButtonColor;
    }

    public toogleCheatMode(): void {
        this.cheatModeActive = !this.cheatModeActive;
        this.cheatButtonColor = this.cheatModeActive ? CHEAT_COLOR : NO_CHEAT_COLOR;
        document.getElementById("cheat-button").style.backgroundColor = this.cheatButtonColor;
    }

    public cheatModeToString(): string {
        return this.cheatModeActive ? "CHEAT MODE ACTIVATE!" : "Click to activate Cheat Mode";
    }
}
