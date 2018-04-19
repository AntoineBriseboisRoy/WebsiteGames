import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { SocketIoService } from "./socket-io.service";
import { IGridWord } from "../../../../common/interfaces/IGridWord";
import { ICell } from "../../../../common/interfaces/ICell";
import { Orientation } from "../../../../common/constants";
import { Observer } from "rxjs/Observer";
import { GameManagerService } from "./game-manager.service";

@Injectable()
export class GridService {
    public gridCells: Array<ICell>;
    public gridWords: Array<IGridWord>;
    public gridWordsHorizontal: Array<IGridWord>;
    public gridWordsVertical: Array<IGridWord>;
    public selectedWords: Array<IGridWord>;
    private static compareIndex(a: IGridWord, b: IGridWord): number {
        return a.cells[0].index - b.cells[0].index;
    }

    public constructor(private socketIO: SocketIoService, private gameManagerService: GameManagerService) {
        this.gridCells = new Array();
        this.gridWords = new Array();
        this.gridWordsHorizontal = new Array();
        this.gridWordsVertical = new Array();
        this.selectedWords = new Array();
        this.initSinglePlayerGame();
    }

    private initSinglePlayerGame(): void {
        if (!this.gameManagerService.isMultiplayer) {
            this.socketIO.StartGame.next({
                userCreator: "Player One",
                difficulty: this.gameManagerService.difficulty,
                userCreatorID: "",
                userJoiner: ""
            });
        }
    }

    public resetGrid(): void {
        this.gridWords.length = 0;
        this.gridCells.length = 0;
        this.gridWordsHorizontal.length = 0;
        this.gridWordsVertical.length = 0;
        this.selectedWords.length = 0;
    }

    public fetchGrid(): Observable<void> {
        return Observable.create((obs: Observer<void>) => {
            this.socketIO.GridContent.subscribe((gridCells: Array<ICell>) => {
                this.addFoundWord(gridCells);
                this.fetchGridWords(obs);
            });
        });
    }

    private addFoundWord(gridCells: Array<ICell>): void {
        for (const serverCell of gridCells) {
            if (this.isFoundOrUndefined(serverCell)) {
                this.gridCells[serverCell.gridIndex] = serverCell;
            }
        }
    }

    private isFoundOrUndefined(serverCell: ICell): boolean {
        return serverCell.isFound || !this.gridCells[serverCell.gridIndex];
    }

    private fetchGridWords(obs: Observer<void>): void {
        this.socketIO.GridWords.subscribe((gridWords: Array<IGridWord>) => {
            this.gridWords = gridWords;
            this.setWordReferencesToCells(this.gridWords);
            this.gridWords.sort(GridService.compareIndex);
            this.splitHorizontalAndVerticalWords();
            this.fetchSelectedWords();
            obs.next(null);
        });
    }

    private setWordReferencesToCells(words: Array<IGridWord>): void {
        for (const word of words) {
            if (word) {
                for (let i: number = 0; i < word.cells.length; i++) {
                    word.cells[i] = this.gridCells[word.cells[i].gridIndex];
                }
            }
        }
    }

    private splitHorizontalAndVerticalWords(): void {
        this.gridWordsHorizontal.length = 0;
        this.gridWordsVertical.length = 0;
        this.gridWords.forEach((word: IGridWord) => {
            if (word.orientation === Orientation.Horizontal) {
                this.gridWordsHorizontal.push(word);
            } else {
                this.gridWordsVertical.push(word);
            }
        });
    }

    private fetchSelectedWords(): void {
        this.socketIO.SelectedWordsSubject.subscribe((selectedWords: Array<IGridWord>) => {
            this.selectedWords = selectedWords;
            this.setWordReferencesToCells(this.selectedWords);
        });
    }
}
