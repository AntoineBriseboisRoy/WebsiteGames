import { Skybox } from "./skybox/skybox";

const N_SKYBOX_STATES: number = 2;

export class DayPeriodContext {

    private states: Skybox[];
    private currentState: Skybox;
    private stateCounter: number;

    public constructor() {
        this.states = new Array<Skybox>();
        this.stateCounter = 0;
    }

    public get CurrentState(): Skybox {
        return this.currentState;
    }

    public get nStates(): number {
        return this.states.length;
    }

    public addState(newState: Skybox): void {
        this.states.push(newState);
    }

    public setInitialState(): void {
        this.currentState = this.states[this.stateCounter];
    }

    public togglePeriod(): void {
        this.stateCounter = ++this.stateCounter % N_SKYBOX_STATES;
        this.currentState = this.states[this.stateCounter];
    }
}
