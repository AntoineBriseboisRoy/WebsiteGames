import { TestBed, inject, async } from "@angular/core/testing";

import { GridService } from "./grid.service";
import { SocketIoService } from "./socket-io.service";
import { ModalService } from "../modal/modal.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgbModalStack } from "@ng-bootstrap/ng-bootstrap/modal/modal-stack";
import { ModalStateService } from "../modal/modal-state.service";
import { RouterTestingModule } from "@angular/router/testing";
import { GameManagerService } from "./game-manager.service";
import { Difficulty } from "../../../../common/constants";

describe("GridService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GridService, SocketIoService, ModalService,
                        NgbModal, NgbModalStack, ModalStateService,
                        GameManagerService],
            imports: [RouterTestingModule]
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

    it("should restart the grid with the same configuration", async(inject([GridService, ModalService, GameManagerService],
                                                                           (gridService: GridService, modalService: ModalService,
                                                                            gameManager: GameManagerService) => {
                const difficulty: Difficulty = gameManager.difficulty;
                const isMultiplayer: boolean = gameManager.isMultiplayer;
                const playerOneUserName: string = gameManager.players[0].username;
                const playerTwoUserName: string = gameManager.players[1].username;

                gridService.fetchGrid().subscribe(() => {
                    for (const cell of gridService.gridCells) {
                        cell.content = cell.content;
                    }
                    for (const word of gridService.gridWords) {
                        word.isFound = true;
                    }
                    expect(modalService.IsOpen).toEqual(true);

                    expect(difficulty).toEqual(gameManager.difficulty);
                    expect(isMultiplayer).toEqual(gameManager.isMultiplayer);
                    expect(playerOneUserName).toEqual(gameManager.players[0].username);
                    expect(playerTwoUserName).toEqual(gameManager.players[1].username);
                });
            })));
    });
