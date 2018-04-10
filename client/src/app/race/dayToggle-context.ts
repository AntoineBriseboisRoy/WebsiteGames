import { SurroundingsTuple } from "./types";
import { RenderService } from "./render-service/render.service";

export class DayPeriodContext {

    private states: SurroundingsTuple[];
    private currentState: SurroundingsTuple;
    private stateCounter: number;

    public constructor(private renderService: RenderService) {
        this.states = new Array<SurroundingsTuple>();
        this.stateCounter = 0;
    }

    public get CurrentState(): SurroundingsTuple {
        return this.currentState;
    }

    public addState(newState: SurroundingsTuple): void {
        this.states.push(newState);
    }

    public setInitialState(): void {
        this.currentState = this.states[this.stateCounter];
    }

    public togglePeriod(): void {
        this.renderService.removeLight();
        this.stateCounter = ++this.stateCounter % this.states.length;
        this.currentState = this.states[this.stateCounter];
        this.renderService.toggleDayNight();
    }
}
