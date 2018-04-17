import { Component, OnInit } from "@angular/core";
import { EndGameService } from "../end-game.service";

@Component({
    selector: "app-waiting-screen",
    templateUrl: "./waiting-screen.component.html",
    styleUrls: ["./waiting-screen.component.css",
                "../game-view/crossword-view.component.css"]
})
export class WaitingScreenComponent implements OnInit {

    public constructor(private endGame: EndGameService) { }

    public ngOnInit(): void {
        this.endGame.subscribeToRestartRequestResponse();
    }
}
