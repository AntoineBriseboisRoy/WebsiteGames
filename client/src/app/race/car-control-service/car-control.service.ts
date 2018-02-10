import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { AbsCarCommand } from "./AbsCarCommand";
import { AccelerateCarCommand } from "./UpCarCommand";
import { RightCarCommand } from "./RightCarCommand";
import { LeftCarCommand } from "./LeftCarCommand";
import { ReleaseSteeringrCommand } from "./ReleaseSteeringCommand";
import { DecelerateCarCommand } from "./DecelerateCarCommand";

const ACCELERATE_KEYCODE: number = 87;  // w
const LEFT_KEYCODE: number = 65;        // a
const BRAKE_KEYCODE: number = 83;       // s
const RIGHT_KEYCODE: number = 68;       // d

interface CommandKeyPair {
    KeyCode: number;
    Command: AbsCarCommand;
}

@Injectable()
export class CarControlService {

    private keyDownCommands: CommandKeyPair[];
    private keyUpCommands: CommandKeyPair[];

    public constructor() { }

    public init(car: Car): void {
        this.keyDownCommands = [
            {KeyCode: ACCELERATE_KEYCODE, Command:  new AccelerateCarCommand(car) },
            {KeyCode: LEFT_KEYCODE, Command: new LeftCarCommand(car) },
            {KeyCode: RIGHT_KEYCODE, Command: new RightCarCommand(car) }
        ];
        this.keyUpCommands = [
            {KeyCode: ACCELERATE_KEYCODE, Command:  new DecelerateCarCommand(car) },
            {KeyCode: RIGHT_KEYCODE, Command: new ReleaseSteeringrCommand(car) },
            {KeyCode: LEFT_KEYCODE, Command: new ReleaseSteeringrCommand(car) }
        ];
    }

    public handleKeyDown(event: KeyboardEvent): void {
        this.keyDownCommands.find((command: CommandKeyPair) => {
            return command.KeyCode === event.keyCode;
        }).Command.execute();
    }

    public handleKeyUp(event: KeyboardEvent): void {
        this.keyUpCommands.find((command: CommandKeyPair) => {
            return command.KeyCode === event.keyCode;
        }).Command.execute();
    }
}
