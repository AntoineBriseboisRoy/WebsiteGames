import { Injectable } from "@angular/core";
import { GridService } from "../../grid.service";
import { ICell } from "../../../../../../common/interfaces/ICell";
import { Orientation } from "../../../../../../common/constants";

export const enum Player {
    player1 = 0,
    player2 = 1
}

@Injectable()
export class SelectionHandlerService {

    public constructor(private gridService: GridService) { }

    public addOrientationBorders(cell: ICell): string {
        if (this.gridService.selectedWords) {
            if (this.isSelectedByOne(Player.player1, cell)) {
                return this.isVerticalOrientation(Player.player1) ?
                    "left-border-p1 right-border-p1" : "top-border-p1 bottom-border-p1";
            } else if (this.isSelectedByOne(Player.player2, cell)) {
                return this.isVerticalOrientation(Player.player2) ?
                    "left-border-p2 right-border-p2" : "top-border-p2 bottom-border-p2";
            } else if (this.isSelectedByBoth(cell)) {
                // TODO: operateur ternaire a regler
                return this.isSameSelection() ?
                    (this.isVerticalOrientation(Player.player1) ?
                        "border-both left-border-both right-border-both" : "border-both top-border-both bottom-border-both") :
                    "border-both top-border-both bottom-border-both left-border-both right-border-both";
            }
        }

        return "";
    }
    private isSelectedByOne(player: Player, cell: ICell): boolean {
        if (player === Player.player1) {
            return this.isSelectedByPlayer(Player.player1, cell) && !this.isSelectedByPlayer(Player.player2, cell);
        }

        return this.isSelectedByPlayer(Player.player2, cell) && !this.isSelectedByPlayer(Player.player1, cell);
    }

    private isCaseSelectedByOne(player: Player, cell: ICell, index: number): boolean {
        if (player === Player.player1) {
            return this.isCaseSelectedByPlayer(Player.player1, cell, index) && !this.isCaseSelectedByPlayer(Player.player2, cell, index);
        }

        return this.isCaseSelectedByPlayer(Player.player2, cell, index) && !this.isCaseSelectedByPlayer(Player.player1, cell, index);
    }

    private isSameSelection(): boolean {
        return this.gridService.selectedWords[Player.player1].correctAnswer
            === this.gridService.selectedWords[Player.player2].correctAnswer;
    }
    private isVerticalOrientation(player: Player): boolean {
        return this.gridService.selectedWords[player].orientation === Orientation.Vertical;
    }

    public addFirstCellBorder(cell: ICell): string {
        if (this.gridService.selectedWords) {
            if (this.isCaseSelectedByOne(Player.player1, cell, 0)) {
                return this.isVerticalOrientation(Player.player1) ?
                    "top-border-p1" : "left-border-p1";
            } else if (this.isCaseSelectedByOne(Player.player2, cell, 0)) {
                return this.isVerticalOrientation(Player.player2) ?
                    "top-border-p2" : "left-border-p2";
            } else if (this.isCaseSelectedByBoth(cell, 0) && this.isSameSelection()) {
                return this.isVerticalOrientation(Player.player1) ?
                    "top-border-both" : "left-border-both";
            }
        }

        return "";
    }

    public addLastCellBorder(cell: ICell): string {
        // if (this.gridService.selectedWords) {
        //     if (this.isCaseSelectedByOne(Player.player1, cell)) {
        //         return this.isVerticalOrientation(Player.player1) ?
        //             "bottom-border-p1" : "right-border-p1";
        //     } else if (this.isCaseSelectedByOne(Player.player2, cell)) {
        //         return this.isVerticalOrientation(Player.player2) ?
        //             "bottom-border-p2" : "right-border-p2";
        //     } else if (this.isCaseSelectedByBoth(cell) && this.isSameSelection()) {
        //         return this.isVerticalOrientation(Player.player1) ?
        //             "bottom-border-both" : "right-border-both";
        //     }
        // }

        return "";
    }

    private isSelectedByPlayer(player: Player, cell: ICell): boolean {
        return this.isSelectedWordDefined(player) &&
            this.gridService.selectedWords[player].cells.includes(cell);
    }

    private isSelectedByBoth(cell: ICell): boolean {
        return this.isSelectedByPlayer(Player.player1, cell) && this.isSelectedByPlayer(Player.player2, cell);
    }

    private isCaseSelectedByPlayer(player: Player, cell: ICell, index: number): boolean {
        return this.isSelectedWordDefined(player) &&
            this.gridService.selectedWords[player].cells[index] === cell;
    }

    private isCaseSelectedByBoth(cell: ICell, index: number): boolean {
        return this.isCaseSelectedByPlayer(Player.player1, cell, index) &&
            this.isCaseSelectedByPlayer(Player.player2, cell, index);
    }

    private isSelectedWordDefined(player: Player): boolean {
        return this.gridService.selectedWords[player] !== undefined &&
            this.gridService.selectedWords[player] !== null &&
            this.gridService.selectedWords[player].cells !== undefined;
    }

}
