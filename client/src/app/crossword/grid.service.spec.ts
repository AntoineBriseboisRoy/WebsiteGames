import { TestBed, inject, async } from "@angular/core/testing";

import { GridService } from "./grid.service";
import { ModalService } from "../modal/modal.service";
import { SocketIoService } from "./socket-io.service";
import { GameManager } from "./game-manager";
import { Difficulty } from "../../../../common/constants";
import { GameRoomManagerService } from "./multiplayer-mode/GameRoomManagerService.service";
import { NgbModalStack } from "@ng-bootstrap/ng-bootstrap/modal/modal-stack";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalStateService } from "../modal/modal-state.service";
import { Router } from "@angular/router/src/router";

fdescribe("GridService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GridService, SocketIoService, ModalService, GameRoomManagerService, NgbModal, NgbModalStack,
                        ModalStateService, Router]
        });
    });

    it("should be created", inject([GridService], (service: GridService) => {
        expect(service).toBeTruthy();
    }));

    it("should open a modal when grid is completed", async(inject([GridService, ModalService],
                                                                  (gridService: GridService, modalService: ModalService) => {
        gridService.fetchGrid().subscribe(() => {
            for (const cell of gridService.gridCells) {
                cell.content = cell.content;
            }
            for (const word of gridService.gridWords) {
                word.isFound = true;
            }
            expect(modalService.IsOpen).toEqual(true);
        });
    })));

    it("should restart the grid with the same configuration", async(inject([GridService, ModalService],
                                                                           (gridService: GridService, modalService: ModalService) => {
        const difficulty: Difficulty = GameManager.Instance.difficulty;
        const isMultiplayer: boolean = GameManager.Instance.isMultiplayer;
        const playerOneUserName: string = GameManager.Instance.playerOne.username;
        const playerTwoUserName: string = GameManager.Instance.playerTwo.username;

        gridService.fetchGrid().subscribe(() => {
            for (const cell of gridService.gridCells) {
                cell.content = cell.content;
            }
            for (const word of gridService.gridWords) {
                word.isFound = true;
            }
            expect(modalService.IsOpen).toEqual(true);

            expect(difficulty).toEqual(GameManager.Instance.difficulty);
            expect(isMultiplayer).toEqual(GameManager.Instance.isMultiplayer);
            expect(playerOneUserName).toEqual(GameManager.Instance.playerOne.username);
            expect(playerTwoUserName).toEqual(GameManager.Instance.playerTwo.username);

        });
    })));
});
