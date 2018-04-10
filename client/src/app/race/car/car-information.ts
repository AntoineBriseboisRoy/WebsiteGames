import { Subscription } from "rxjs/Subscription";
import { LAP_NUMBER } from "../../constants";

export class CarInformation {
    private lap: number;
    public totalTime: Date;
    private hasStartedAFirstLap: boolean;
    private lapTimes: Array<Date>;
    private subscription: Subscription;
    public constructor() {
        this.lap = 1;
        this.totalTime = new Date(0);
        this.hasStartedAFirstLap = false;
        this.lapTimes = new Array<Date>();
        this.subscription = new Subscription();
    }

    public get Lap(): number {
        return this.lap;
    }

    public get CurrentLapTime(): number {
        return this.totalTime.getTime() - this.lapTimes.reduce((a, b) => a + b.getTime(), 0);
    }

    public incrementLap(): void {
        if (this.hasStartedAFirstLap) {
            this.lapTimes.push(new Date(this.CurrentLapTime));
            if (this.lap !== LAP_NUMBER ) {
                this.lap++;
            }
        } else {
            this.hasStartedAFirstLap = true;
        }
    }

    public startTimer(subscription: Subscription): void {
        this.subscription = subscription;
    }

    public stopTimer(): void {
        this.subscription.unsubscribe();
    }
}
