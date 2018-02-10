import { Injectable } from "@angular/core";
import { Car } from "../car/car";

const ACCELERATE_KEYCODE: number = 87;  // w
const LEFT_KEYCODE: number = 65;        // a
const BRAKE_KEYCODE: number = 83;       // s
const RIGHT_KEYCODE: number = 68;       // d

@Injectable()
export class CarControlService {

    public constructor() {
    }

    public handleKeyDown(event: KeyboardEvent, car: Car): void {
        switch (event.keyCode) {
            case ACCELERATE_KEYCODE:
                car.isAcceleratorPressed = true;
                break;
            case LEFT_KEYCODE:
                car.steerLeft();
                break;
            case RIGHT_KEYCODE:
                car.steerRight();
                break;
            case BRAKE_KEYCODE:
                car.brake();
                break;
            default:
                break;
        }
    }

    public handleKeyUp(event: KeyboardEvent, car: Car): void {
        switch (event.keyCode) {
            case ACCELERATE_KEYCODE:
                car.isAcceleratorPressed = false;
                break;
            case LEFT_KEYCODE:
            case RIGHT_KEYCODE:
                car.releaseSteering();
                break;
            case BRAKE_KEYCODE:
                car.releaseBrakes();
                break;
            default:
                break;
        }
    }
}
