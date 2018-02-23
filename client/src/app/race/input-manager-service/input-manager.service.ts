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
import { PerspectiveCamera } from "three";
import { ThirdPersonCamera } from "../camera/camera-perspective";
import { RenderService } from "../render-service/render.service";
import { BrakeCarCommand } from "./car-commands/BrakeCarCommand";
import { ReleaseBrakeCommand } from "./car-commands/ReleaseBrakeCommand";
import { CameraContext } from "../camera/camera-context";
import { SwapCameraCommand } from "./camera-commands/SwapCameraCommand";
import { CommandKeyPair } from "./CommandKeyPair";

const ACCELERATE_KEYCODE: number = 87; // w
const LEFT_KEYCODE: number = 65;       // a
const BRAKE_KEYCODE: number = 83;      // s
const RIGHT_KEYCODE: number = 68;      // d
const ZOOM_IN_KEYCODE: number = 90;    // z
const ZOOM_OUT_KEYCODE: number = 88;   // x
const SWAP_CAM_KEYCODE: number = 67;   // c

@Injectable()
export class InputManagerService {

    private keyDownCommands: CommandKeyPair[];
    private keyUpCommands: CommandKeyPair[];

    public constructor() { }

    public init(car: Car, cameraContext: CameraContext): void {
        this.keyDownCommands = [
            { KeyCode: ACCELERATE_KEYCODE, Command: new AccelerateCarCommand(car) },
            { KeyCode: LEFT_KEYCODE, Command: new LeftCarCommand(car) },
            { KeyCode: RIGHT_KEYCODE, Command: new RightCarCommand(car) },
            { KeyCode: ZOOM_IN_KEYCODE, Command: new ZoomInCommand(cameraContext) },
            { KeyCode: ZOOM_OUT_KEYCODE, Command: new ZoomOutCommand(cameraContext) },
            { KeyCode: BRAKE_KEYCODE, Command: new BrakeCarCommand(car) },
            { KeyCode: SWAP_CAM_KEYCODE, Command: new SwapCameraCommand(cameraContext) }
        ];
        this.keyUpCommands = [
            { KeyCode: ACCELERATE_KEYCODE, Command: new DecelerateCarCommand(car) },
            { KeyCode: RIGHT_KEYCODE, Command: new ReleaseSteeringCommand(car) },
            { KeyCode: LEFT_KEYCODE, Command: new ReleaseSteeringCommand(car) },
            { KeyCode: BRAKE_KEYCODE, Command: new ReleaseBrakeCommand(car) }
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

    public handleKeyUp(event: KeyboardEvent): void {
         const command: CommandKeyPair = this.keyUpCommands.find((cmd: CommandKeyPair) => {
            return cmd.KeyCode === event.keyCode;
         });
         if (command) {
            command.Command.execute();
         }
    }
}
