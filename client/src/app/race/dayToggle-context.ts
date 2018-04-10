import { Tuple } from "./types";
import { RenderService } from "./render-service/render.service";

export class DayPeriodContext {

    private states: Tuple[];
    private currentState: Tuple;
    private stateCounter: number;

    public constructor(private renderService: RenderService) {
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
        this.renderService.removeLight();
        this.stateCounter = ++this.stateCounter % this.nStates;
        this.currentState = this.states[this.stateCounter];
        this.renderService.toggleDayNight();
    }
}
