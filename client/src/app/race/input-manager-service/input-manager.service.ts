import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { AccelerateCarCommand } from "./car-commands/UpCarCommand";
import { RightCarCommand } from "./car-commands/RightCarCommand";
import { LeftCarCommand } from "./car-commands/LeftCarCommand";
import { ReleaseSteeringCommand } from "./car-commands/ReleaseSteeringCommand";
import { DecelerateCarCommand } from "./car-commands/DecelerateCarCommand";
import { AbsCommand } from "./AbsCommand";
import { ZoomInCommand } from "./camera-commands/ZoomInCommand";
import { ZoomOutCommand } from "./camera-commands/ZoomOutCommand";
import { GameCamera } from "../camera/game-camera";

const ACCELERATE_KEYCODE: number = 87;  // w
const LEFT_KEYCODE: number = 65;        // a
const BRAKE_KEYCODE: number = 83;       // s
const RIGHT_KEYCODE: number = 68;       // d
const ZOOM_IN_KEYCODE: number = 90;    // z
const ZOOM_OUT_KEYCODE: number = 88;   // x

interface CommandKeyPair {
    KeyCode: number;
    Command: AbsCommand;
}

@Injectable()
export class InputManagerService {

    private keyDownCommands: CommandKeyPair[];
    private keyUpCommands: CommandKeyPair[];

    public constructor() { }

    public init(car: Car, camera: GameCamera): void {
        this.keyDownCommands = [
            {KeyCode: ACCELERATE_KEYCODE, Command:  new AccelerateCarCommand(car) },
            {KeyCode: LEFT_KEYCODE, Command: new LeftCarCommand(car) },
            {KeyCode: RIGHT_KEYCODE, Command: new RightCarCommand(car) },
            {KeyCode: ZOOM_IN_KEYCODE, Command: new ZoomInCommand(camera) },
            {KeyCode: ZOOM_OUT_KEYCODE, Command: new ZoomOutCommand(camera) }
        ];
        this.keyUpCommands = [
            {KeyCode: ACCELERATE_KEYCODE, Command:  new DecelerateCarCommand(car) },
            {KeyCode: RIGHT_KEYCODE, Command: new ReleaseSteeringCommand(car) },
            {KeyCode: LEFT_KEYCODE, Command: new ReleaseSteeringCommand(car) }
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
