import { TestBed, inject, async } from "@angular/core/testing";

import { EndGameService } from "./end-game.service";
import { GridService } from "./grid.service";
import { ModalService } from "../modal/modal.service";
import { GameManagerService } from "./game-manager.service";
import { SocketIoService } from "./socket-io.service";
import { ICell, CellColor, Finder } from "../../../../common/interfaces/ICell";
import { IGridWord } from "../../../../common/interfaces/IGridWord";
import { Orientation, Difficulty } from "../../../../common/constants";
import { NgbModalStack } from "@ng-bootstrap/ng-bootstrap/modal/modal-stack";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalStateService } from "../modal/modal-state.service";

describe("EndGameService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GridService, GameManagerService, SocketIoService, ModalService,
                        EndGameService, GridService, SocketIoService, ModalService,
                        NgbModal, NgbModalStack, ModalStateService,
                        GameManagerService]
        });
    });

    it("should be created", inject([EndGameService], (service: EndGameService) => {
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
    it("should restart a game with different cells", inject([GridService, GameManagerService, SocketIoService, ModalService,
                                                             EndGameService],
                                                            (gridService: GridService, gameManagerService: GameManagerService,
                                                             socketIoService: SocketIoService, modal: ModalService,
                                                             service: EndGameService) => {

            service.initSubscriptions();
            gridService.gridWords.length = 1;
            gridService.gridCells.length = 1;
            gridService.gridWordsHorizontal.length = 1;
            gridService.gridWordsVertical.length = 0;
            gridService.selectedWords.length = 0;

            const iCell: ICell = {
                gridIndex: 1, index: 0, answer: "a", cellColor: CellColor.White, content: "a",
                isFound: true, finder: Finder.player1
            };

            gridService.gridCells.push(iCell);
            const iGridWord: IGridWord = {
                cells: gridService.gridCells, correctAnswer: iCell.content, definition: "bidon",
                orientation: Orientation.Horizontal, isFound: iCell.isFound
            };
            gridService.gridWords.push(iGridWord);

            service["sendRestartRequestMultiplayer"]();
            socketIoService.RestartedGameSubject.next({ requestSent: false, requestAccepted: true });
            let isSameGridContent: boolean = true;
            socketIoService.GridContent.subscribe((cells: ICell[]) => (cells[0] !== gridService.gridCells[0] ? isSameGridContent = false
                : isSameGridContent = true));
            expect(isSameGridContent).toEqual(false);
        }));
    it("should restart a game with different IGridWords", inject([GridService, GameManagerService, SocketIoService, ModalService,
                                                                  EndGameService],
                                                                 (gridService: GridService, gameManagerService: GameManagerService,
                                                                  socketIoService: SocketIoService, modal: ModalService,
                                                                  service: EndGameService) => {

        service.initSubscriptions();
        gridService.gridWords.length = 1;
        gridService.gridCells.length = 1;
        gridService.gridWordsHorizontal.length = 1;
        gridService.gridWordsVertical.length = 0;
        gridService.selectedWords.length = 0;

        const iCell: ICell = {
            gridIndex: 1, index: 0, answer: "a", cellColor: CellColor.White, content: "a",
            isFound: true, finder: Finder.player1
        };

        gridService.gridCells.push(iCell);
        const iGridWord: IGridWord = {
            cells: gridService.gridCells, correctAnswer: iCell.content, definition: "bidon",
            orientation: Orientation.Horizontal, isFound: iCell.isFound
        };
        gridService.gridWords.push(iGridWord);

        service["sendRestartRequestMultiplayer"]();
        socketIoService.RestartedGameSubject.next({ requestSent: false, requestAccepted: true });
        let isSameGridWords: boolean = true;
        socketIoService.GridWords.subscribe((words: IGridWord[]) => (isSameGridWords = words[0] === gridService.gridWords[0]));
        expect(isSameGridWords).toEqual(false);
        }));
    it("should restart a game with same difficulty", inject([GridService, GameManagerService, SocketIoService, ModalService,
                                                             EndGameService],
                                                            (gridService: GridService, gameManagerService: GameManagerService,
                                                             socketIoService: SocketIoService, modal: ModalService,
                                                             service: EndGameService) => {

        service.initSubscriptions();
        gridService.gridWords.length = 1;
        gridService.gridCells.length = 1;
        gridService.gridWordsHorizontal.length = 1;
        gridService.gridWordsVertical.length = 0;
        gridService.selectedWords.length = 0;

        const iCell: ICell = {
        gridIndex: 1, index: 0, answer: "a", cellColor: CellColor.White, content: "a",
        isFound: true, finder: Finder.player1
        };

        gridService.gridCells.push(iCell);
        const iGridWord: IGridWord = {
        cells: gridService.gridCells, correctAnswer: iCell.content, definition: "bidon",
        orientation: Orientation.Horizontal, isFound: iCell.isFound
        };
        gridService.gridWords.push(iGridWord);

        service["sendRestartRequestMultiplayer"]();
        socketIoService.RestartedGameSubject.next({ requestSent: false, requestAccepted: true });

        const previousDifficulty: Difficulty = gameManagerService.difficulty;
        socketIoService.GridWords.subscribe(() => expect(previousDifficulty).toEqual(gameManagerService.difficulty));

    }));

});
