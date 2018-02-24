import { Injectable } from "@angular/core";
import { ICell } from "../../interfaces/ICell";
import { AbsCommand } from "./AbsCommand";
import { CommandKeyPair } from "./CommandKeyPair";
import { MoveLeftCommand } from "./grid-commands/moveLeftCommand";
import { MoveUpCommand } from "./grid-commands/moveUpCommand";
import { MoveRightCommand } from "./grid-commands/moveRightCommand";
import { MoveDownCommand } from "./grid-commands/moveDownCommand";
import { ServiceBuilder } from "selenium-webdriver/chrome";

const LEFT_ARROW_KEYCODE: number = 37;
const UP_ARROW_KEYCODE: number = 38;
const RIGHT_ARROW_KEYCODE: number = 39;
const DOWN_ARROW_KEYCODE: number = 40;

@Injectable()
export class KeyboardInputManagerService {
    private keyDownCommands: CommandKeyPair[];

    public constructor(cells: Array<ICell>) {
        this.keyDownCommands = [
            { KeyCode: LEFT_ARROW_KEYCODE,  Command: new MoveLeftCommand(cells) },
            { KeyCode: UP_ARROW_KEYCODE,    Command: new MoveUpCommand(cells) },
            { KeyCode: RIGHT_ARROW_KEYCODE, Command: new MoveRightCommand(cells) },
            { KeyCode: DOWN_ARROW_KEYCODE,  Command: new MoveDownCommand(cells) }
        ];
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
