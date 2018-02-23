import { Injectable } from "@angular/core";
import { AbsCommand } from "./AbsCommand";
import { CommandKeyPair } from "./CommandKeyPair";
import { MoveLeftCommand } from "./grid-commands/moveLeftCommand";
import { MoveUpCommand } from "./grid-commands/moveUpCommand";
import { MoveRightCommand } from "./grid-commands/moveRightCommand";
import { MoveDownCommand } from "./grid-commands/moveDownCommand";

const LEFT_ARROW_KEYCODE: number = 37;
const UP_ARROW_KEYCODE: number = 38;
const RIGHT_ARROW_KEYCODE: number = 39;
const DOWN_ARROW_KEYCODE: number = 40;

@Injectable()
export class KeywordInputManagerService {
    private keyDownCommands: CommandKeyPair[];

    public constructor() {
        this.keyDownCommands = [  // POURQUOI METTRE DANS FONCTION INIT()?
            { KeyCode: LEFT_ARROW_KEYCODE,  Command: new MoveLeftCommand() },
            { KeyCode: UP_ARROW_KEYCODE,    Command: new MoveUpCommand() },
            { KeyCode: RIGHT_ARROW_KEYCODE, Command: new MoveRightCommand() },
            { KeyCode: DOWN_ARROW_KEYCODE,  Command: new MoveDownCommand() },
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
