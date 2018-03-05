import { Car } from "../car/car";
import { CameraState } from "./camera-state";
import { Vector3 } from "three";

const N_CAMERA_STATES: number = 2;

export class CameraContext {

    private states: CameraState[];
    private currentState: CameraState;
    private stateCounter: number;

    public constructor() {
        this.states = new Array<CameraState>();
        this.stateCounter = 0;
    }

    public get CurrentState(): CameraState {
        return this.currentState;
    }

    public get nStates(): number {
        return this.states.length;
    }

    public addState(newState: CameraState): void {
        this.states.push(newState);
    }

    public initStates(lookAt: Vector3): void {
        this.states.forEach((state: CameraState) => {
            state.init(lookAt);
        });
    }

    public setInitialState(): void {
        this.currentState = this.states[this.stateCounter];
    }

    public swapCameraState(): void {
        this.currentState = this.states[++this.stateCounter % N_CAMERA_STATES];
    }

    public update(car: Car): void {
        this.currentState.update(car);
    }

    public zoomIn(): void {
        this.currentState.zoomIn();
    }

    public zoomOut(): void {
        this.currentState.zoomOut();
    }

    public onResize(width: number, height: number): void {
        this.currentState.onResize(width, height);
    }
}
