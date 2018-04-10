import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { AccelerateCarCommand } from "./car-commands/AccelerateCarCommand";
import { RightCarCommand } from "./car-commands/RightCarCommand";
import { LeftCarCommand } from "./car-commands/LeftCarCommand";
import { ReleaseSteeringCommand } from "./car-commands/ReleaseSteeringCommand";
import { DecelerateCarCommand } from "./car-commands/DecelerateCarCommand";
import { AbsCommand } from "./AbsCommand";
import { ZoomInCommand } from "./camera-commands/ZoomInCommand";
import { ZoomOutCommand } from "./camera-commands/ZoomOutCommand";
import { BrakeCarCommand } from "./car-commands/BrakeCarCommand";
import { ReleaseBrakeCommand } from "./car-commands/ReleaseBrakeCommand";
import { CameraContext } from "../camera/camera-context";
import { SwapCameraCommand } from "./camera-commands/SwapCameraCommand";
import { ToggleCarLightsCommand } from "./car-commands/ToggleCarLightsCommand";
import { ToggleDayPeriodCommand } from "./dayNight-commands/toggleDayPeriodCommand";
import { DayPeriodContext } from "../dayToggle-context";

export const ACCELERATE_KEYCODE: number = 87; // w
export const LEFT_KEYCODE: number = 65;       // a
export const BRAKE_KEYCODE: number = 83;      // s
export const RIGHT_KEYCODE: number = 68;      // d
export const ZOOM_IN_KEYCODE: number = 187;    // +
export const ZOOM_OUT_KEYCODE: number = 189;   // -
export const SWAP_CAM_KEYCODE: number = 67;   // c
export const TOGGLE_HEADLIGHTS_KEYCODE: number = 76; // l
export const TOGGLE_DAYPERIOD_KEYCODE: number = 78; // n

@Injectable()
export class InputManagerService {

    private keyDownCommands: Map<number, AbsCommand>;
    private keyUpCommands: Map<number, AbsCommand>;

    public constructor() {
        this.keyDownCommands = new Map<number, AbsCommand>();
        this.keyUpCommands = new Map<number, AbsCommand>();
    }

    public init(car: Car, cameraContext: CameraContext, dayPeriodContext: DayPeriodContext): void {
        this.setDownKeyBindings(car, cameraContext, dayPeriodContext);
        this.setUpKeyBindings(car, cameraContext);
    }

    private setDownKeyBindings(car: Car, cameraContext: CameraContext, dayPeriodContext: DayPeriodContext): void {
        this.keyDownCommands.set(ACCELERATE_KEYCODE, new AccelerateCarCommand(car));
        this.keyDownCommands.set(LEFT_KEYCODE, new LeftCarCommand(car));
        this.keyDownCommands.set(RIGHT_KEYCODE, new RightCarCommand(car));
        this.keyDownCommands.set(ZOOM_IN_KEYCODE, new ZoomInCommand(cameraContext));
        this.keyDownCommands.set(ZOOM_OUT_KEYCODE, new ZoomOutCommand(cameraContext));
        this.keyDownCommands.set(BRAKE_KEYCODE, new BrakeCarCommand(car));
        this.keyDownCommands.set(SWAP_CAM_KEYCODE, new SwapCameraCommand(cameraContext));
        this.keyDownCommands.set(TOGGLE_HEADLIGHTS_KEYCODE, new ToggleCarLightsCommand(car));
        this.keyDownCommands.set(TOGGLE_DAYPERIOD_KEYCODE, new ToggleDayPeriodCommand(dayPeriodContext));
    }

    private setUpKeyBindings(car: Car, cameraContext: CameraContext): void {
        this.keyUpCommands.set(ACCELERATE_KEYCODE, new DecelerateCarCommand(car));
        this.keyUpCommands.set(RIGHT_KEYCODE, new ReleaseSteeringCommand(car));
        this.keyUpCommands.set(LEFT_KEYCODE, new ReleaseSteeringCommand(car));
        this.keyUpCommands.set(BRAKE_KEYCODE, new ReleaseBrakeCommand(car));
    }

    public handleKeyDown(eventKeyCode: number): void {
        const command: AbsCommand = this.keyDownCommands.get(eventKeyCode);
        if (command) {
            command.execute();
        }
    }

    public handleKeyUp(eventKeyCode: number): void {
         const command: AbsCommand = this.keyUpCommands.get(eventKeyCode);
         if (command) {
            command.execute();
         }
    }
}
