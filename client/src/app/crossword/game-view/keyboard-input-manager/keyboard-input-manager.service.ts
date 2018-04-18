import { Injectable } from "@angular/core";
import { ICell } from "../../../../../../common/interfaces/ICell";
import { ClearLetterCommand } from "./grid-commands/clearLetterCommand";
import { LetterCommand } from "./grid-commands/letterCommand";
import { MoveLeftCommand } from "./grid-commands/moveLeftCommand";
import { MoveUpCommand } from "./grid-commands/moveUpCommand";
import { MoveRightCommand } from "./grid-commands/moveRightCommand";
import { MoveDownCommand } from "./grid-commands/moveDownCommand";
import { AbsCommand } from "../../../race/input-manager-service/AbsCommand";

const BACKSPACE_KEYCODE: number = 8;
const LEFT_ARROW_KEYCODE: number = 37;
const UP_ARROW_KEYCODE: number = 38;
const RIGHT_ARROW_KEYCODE: number = 39;
const DOWN_ARROW_KEYCODE: number = 40;
const LETTER_A_KEYCODE: number = 65;
const LETTER_Z_KEYCODE: number = 90;
@Injectable()
export class KeyboardInputManagerService {
    private keyDownCommands: Map<number, AbsCommand>;

    public constructor(cells: Array<ICell>) {
        this.preventBackspaceBinding();
        this.setKeyDownBindings(cells);
    }

    private preventBackspaceBinding(): void {
        window.onkeydown = (e: KeyboardEvent) => {
            if (e.keyCode === BACKSPACE_KEYCODE && e.target === document.body) {
              e.preventDefault();
            }
        };
    }
    private setKeyDownBindings(cells: Array<ICell>): void {
        this.keyDownCommands = new Map<number, AbsCommand>();
        this.keyDownCommands.set(BACKSPACE_KEYCODE, new ClearLetterCommand(cells));
        this.keyDownCommands.set(LEFT_ARROW_KEYCODE, new MoveLeftCommand(cells));
        this.keyDownCommands.set(UP_ARROW_KEYCODE, new MoveUpCommand(cells));
        this.keyDownCommands.set(RIGHT_ARROW_KEYCODE, new MoveRightCommand(cells));
        this.keyDownCommands.set(DOWN_ARROW_KEYCODE, new MoveDownCommand(cells));

        for (let i: number = LETTER_A_KEYCODE; i <= LETTER_Z_KEYCODE; i++) {
            this.keyDownCommands.set(i, new LetterCommand(cells, i));
        }
    }
    public handleKeyDown(keyCode: number): void {
        const command: AbsCommand = this.keyDownCommands.get(keyCode);
        if (command) {
            command.execute();
        }
    }
}
