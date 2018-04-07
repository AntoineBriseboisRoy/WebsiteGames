import { Tuple } from "./types";

const N_SKYBOX_STATES: number = 2;
export class DayPeriodContext {

    private states: Tuple[];
    private currentState: Tuple;
    private stateCounter: number;

    public constructor() {
        this.states = new Array<Tuple>();
        this.stateCounter = 0;
    }

    public get CurrentState(): Tuple {
        return this.currentState;
    }

    public get nStates(): number {
        return this.states.length;
    }

    public addState(newState: Tuple): void {
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
