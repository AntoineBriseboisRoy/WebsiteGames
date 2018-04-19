import { TestBed, inject, async } from "@angular/core/testing";

import { GridService } from "./grid.service";
import { SocketIoService } from "./socket-io.service";
import { ModalService } from "../modal/modal.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgbModalStack } from "@ng-bootstrap/ng-bootstrap/modal/modal-stack";
import { ModalStateService } from "../modal/modal-state.service";
import { RouterTestingModule } from "@angular/router/testing";
import { GameManagerService } from "./game-manager.service";
import { Difficulty, Orientation } from "../../../../common/constants";
import { CellColor, Finder, ICell } from "../../../../common/interfaces/ICell";
import { IGridWord } from "../../../../common/interfaces/IGridWord";
import { GameRoomManagerService } from "./multiplayer-mode/game-room-manager.service";

// tslint:disable:no-magic-numbers

fdescribe("GridService", () => {
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

    it("should fetch selected words", async(inject([GridService, SocketIoService],
                                                   (gridService: GridService, socketIO: SocketIoService) => {

        gridService.gridWords.length = 2;
        gridService.gridCells.length = 2;
        gridService.gridWordsHorizontal.length = 2;
        gridService.gridWordsVertical.length = 0;

        const iCell: ICell = {
        gridIndex: 1, index: 0, answer: "a", cellColor: CellColor.White, content: "a",
        isFound: true, finder: Finder.nobody
        };
        const iWord: IGridWord = {
            cells: [iCell], correctAnswer: "a", definition: "bidon", orientation: Orientation.Horizontal, isFound: false
        };
        expect(gridService.selectedWords.length).toBe(0);
        socketIO.SelectedWordsSubject.next([iWord]);
        socketIO.SelectedWordsSubject.subscribe((selectedWords: Array<IGridWord>) => {
            expect(gridService.selectedWords.length).toBe(1);
            expect(gridService.selectedWords[0]).toBe(iWord);
        });
    })));

    it("should fetch found words in multiplayer", async(inject([GameRoomManagerService, GridService, SocketIoService],
                                                               (gameRoomManagerService: GameRoomManagerService,
                                                                gridService: GridService, socketIO: SocketIoService) => {

        gridService.gridWords.length = 2;
        gridService.gridCells.length = 2;
        gridService.gridWordsHorizontal.length = 2;
        gridService.gridWordsVertical.length = 0;

        gridService.gridCells[0] = {
            gridIndex: 1, index: 0, answer: "a", cellColor: CellColor.White, content: "a",
            isFound: true, finder: Finder.player1
        };
        const iWord: IGridWord = {
            cells: gridService.gridCells, correctAnswer: "a", definition: "bidon", orientation: Orientation.Horizontal, isFound: true
        };
        expect(gridService.gridWords.filter((word: IGridWord) => word.isFound).length).toBe(0);
        socketIO.SelectedWordsSubject.next([iWord]);
        socketIO.SelectedWordsSubject.subscribe((selectedWords: Array<IGridWord>) => {
            expect(gridService.gridWords.filter((word: IGridWord) => word.isFound).length).toBe(0);
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
