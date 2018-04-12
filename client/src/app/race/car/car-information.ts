import { Subscription } from "rxjs/Subscription";
import { LAP_NUMBER } from "../../constants";
import { Vector2 } from "three";

export class CarInformation {
    private lap: number;
    public totalTime: Date;
    public way: boolean;
    private hasStartedAFirstLap: boolean;
    private lapTimes: Array<Date>;
    private subscription: Subscription;

    // For AI :
    private checkpoints: Array<Vector2>;
    public nextCheckpoint: Vector2;
    private distanceToNextCheckpoint: Vector2;
    // -----
    public constructor() {
        this.lap = 1;
        this.totalTime = new Date(0);
        this.hasStartedAFirstLap = false;
        this.lapTimes = new Array<Date>();
        this.subscription = new Subscription();
        this.way = true;
        this.checkpoints = new Array<Vector2>();
        this.distanceToNextCheckpoint = new Vector2();
        this.nextCheckpoint = new Vector2();
    }

    public get Lap(): number {
        return this.lap;
    }

    public get CurrentLapTime(): number {
        return this.totalTime.getTime() - this.lapTimes.reduce((a, b) => a + b.getTime(), 0);
    }

    public addCheckpoint( checkpoint: Vector2): void {
        this.checkpoints.push(checkpoint);
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

    public setNextCheckpoint( checkpoint: number ): void {
        this.nextCheckpoint = this.checkpoints[checkpoint];
        console.log("----------------------");
        console.log("PROCHAIN CHECKPOINT: " + checkpoint);
        console.log("----------------------");
    }

    public updateDistanceToNextCheckpoint(meshPosition: Vector2): void {
        this.distanceToNextCheckpoint.subVectors(this.nextCheckpoint, meshPosition);
        console.log(this.distanceToNextCheckpoint.length());
    }
}
