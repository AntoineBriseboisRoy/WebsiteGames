import { TestBed, inject, async } from "@angular/core/testing";

import { EndGameService } from "./end-game.service";
import { GridService } from "./grid.service";
import { ModalService } from "../modal/modal.service";

describe("EndGameService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EndGameService]
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

    it("should call all the subscribe dans initSubscriptions", inject([EndGameService], (endGameService: EndGameService) => {
        const spy: jasmine.Spy = spyOn(endGameService, "initSubscriptions");
    }));
});
