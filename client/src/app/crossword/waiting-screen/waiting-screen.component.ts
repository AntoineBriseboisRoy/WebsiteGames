import { Component, OnInit } from "@angular/core";
import { SocketIoService } from "../socket-io.service";
import { IRestartGame } from "../../../../../common/interfaces/IRestartGame";
import { Router } from "@angular/router";
import { ModalService } from "../../modal/modal.service";

@Component({
    selector: "app-waiting-screen",
    templateUrl: "./waiting-screen.component.html",
    styleUrls: ["./waiting-screen.component.css",
                "../game-view/crossword-view.component.css"]
})
export class WaitingScreenComponent implements OnInit {

    public constructor(private socketIo: SocketIoService, private router: Router, private modalService: ModalService) { }

    public ngOnInit(): void {
        this.socketIo.RestartedGameSubject.subscribe((restartGame: IRestartGame) => {
            if (restartGame.requestAccepted) {
                this.router.navigate(["crossword/play"]);
            } else {
                this.openRefusedRestartGameModal();
            }
        });
    }

    private openRefusedRestartGameModal(): void {
        this.modalService.open({
            title: "Your opponent doesn't want to play again",
            message: "You can play another crossword game or try our fabulous race game.",
            firstButton: "Home", secondButton: "Start a solo game ", showPreview: false
        })
            .then(() => this.router.navigate([""]),
                  () => this.router.navigate(["crossword/play"])
            );
    }
}
