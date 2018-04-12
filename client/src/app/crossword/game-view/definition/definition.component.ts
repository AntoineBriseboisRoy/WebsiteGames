import { Component } from "@angular/core";
import { NO_CHEAT_COLOR, CHEAT_COLOR } from "../../../constants";
import { GridService } from "../../grid.service";
import { IGridWord } from "../../../../../../common/interfaces/IGridWord";
import { ICell, Finder } from "../../../../../../common/interfaces/ICell";
import { FocusCell } from "../focusCell";
import { SocketIoService } from "../../socket-io.service";

@Component({
    selector: "app-crossword-definition",
    templateUrl: "./definition.component.html",
    styleUrls: ["./definition.component.css"]
})

export class DefinitionComponent {
    public choosedDefinition: string;
    public cheatModeActive: boolean;
    public cheatButtonColor: string;
    private focusCell: FocusCell;

    public constructor(private gridService: GridService, private socketIo: SocketIoService) {
        this.choosedDefinition = "";
        this.cheatModeActive = false;
        this.cheatButtonColor = NO_CHEAT_COLOR;
        this.focusCell = FocusCell.Instance;
    }

    public focusOnCell(choosedDefinition: string): void {
        this.gridService.gridWords.forEach((word: IGridWord, index: number) => {
            if (word.definition === choosedDefinition) {
                this.focusCell.cell = word.cells[this.firstUnknownCell(word.cells)];
                this.focusCell.cells = word.cells;
                this.focusCell.Orientation = word.orientation;
                this.choosedDefinition = word.definition;
                if (this.isAlreadyFoundWord()) {
                    this.focusCell.clear();
                    this.choosedDefinition = undefined;
                } else {
                    this.socketIo.SelectedWordsSubject.next([word]);
                }
            }
        });
    }

    public toogleCheatMode(): void {
        this.cheatModeActive = !this.cheatModeActive;
        this.cheatButtonColor = this.cheatModeActive ? CHEAT_COLOR : NO_CHEAT_COLOR;
    }

    public cheatModeToString(): string {
        return this.cheatModeActive ? "CHEAT MODE ACTIVATE!" : "Click to activate Cheat Mode";
    }

    public isFoundBy(word: IGridWord): string {
        if (word.isFound) {
            return this.isWordFoundByPlayer(word.cells, Finder.player1) ? "word-definition-found is-found-p1" :
                                                                          "word-definition-found is-found-p2";
        }

        return "";
    }

    private isWordFoundByPlayer(cells: Array<ICell>, player: Finder): boolean {
        for (const cell of cells) {
            if (cell.finder !== Finder.both) {
                return cell.finder === player;
            }
        }

        return false;
    }

    private firstUnknownCell(cells: Array<ICell>): number {
        for (let i: number = 0; i < cells.length; i++) {
            if (!cells[i].isFound) {
                return i;
            }
        }

        return 0;
    }

    private isAlreadyFoundWord(): boolean {
        let isFoundWord: boolean = true;
        this.focusCell.cells.forEach((cell: ICell) => {
            if (!cell.isFound) {
                isFoundWord = false;
            }
        });

        return isFoundWord;
    }
}
