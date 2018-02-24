import { Injectable } from "@angular/core";
import { ICell } from "../../interfaces/ICell";
import { CommandKeyPair } from "./CommandKeyPair";
import { ClearLetterCommand } from "./grid-commands/clearLetterCommand";
import { LetterCommand } from "./grid-commands/letterCommand";
import { MoveLeftCommand } from "./grid-commands/moveLeftCommand";
import { MoveUpCommand } from "./grid-commands/moveUpCommand";
import { MoveRightCommand } from "./grid-commands/moveRightCommand";
import { MoveDownCommand } from "./grid-commands/moveDownCommand";

const BACKSPACE_KEYCODE: number = 8;
const LEFT_ARROW_KEYCODE: number = 37;
const UP_ARROW_KEYCODE: number = 38;
const RIGHT_ARROW_KEYCODE: number = 39;
const DOWN_ARROW_KEYCODE: number = 40;
const LETTER_A_KEYCODE: number = 65;
const LETTER_Z_KEYCODE: number = 90;

@Injectable()
export class KeyboardInputManagerService {
    private keyDownCommands: CommandKeyPair[];

    public constructor(cells: Array<ICell>) {
        this.keyDownCommands = [
            { KeyCode: BACKSPACE_KEYCODE, Command: new ClearLetterCommand(cells) },
            { KeyCode: LEFT_ARROW_KEYCODE,  Command: new MoveLeftCommand(cells) },
            { KeyCode: UP_ARROW_KEYCODE,    Command: new MoveUpCommand(cells) },
            { KeyCode: RIGHT_ARROW_KEYCODE, Command: new MoveRightCommand(cells) },
            { KeyCode: DOWN_ARROW_KEYCODE,  Command: new MoveDownCommand(cells) }
        ];
        for ( let i: number = LETTER_A_KEYCODE; i <= LETTER_Z_KEYCODE; i++ ) {
            this.keyDownCommands.push({KeyCode: i, Command: new LetterCommand(cells, i)});
        }
    }

    public handleKeyDown(event: KeyboardEvent): void {
        const command: CommandKeyPair = this.keyDownCommands.find((cmd: CommandKeyPair) => {
            return cmd.KeyCode === event.keyCode;
        });
        if (command) {
            command.Command.execute();
        }
    }
}
