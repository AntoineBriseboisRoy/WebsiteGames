import { Subscription } from "rxjs/Subscription";
import { LAP_NUMBER } from "../../constants";
import { Vector2 } from "three";

export class CarInformation {
    private lap: number;
    public totalTime: Date;
    private isGoingForward: boolean;
    private hasStartedAFirstLap: boolean;
    private hasCrossedStartLineBackward: boolean;
    private lapTimes: Array<Date>;
    private subscription: Subscription;

    // For AI :
    private checkpoints: Array<Vector2>;
    public nextCheckpoint: Vector2;
    private precedentDistanceToNextCheckpoint: Vector2;
    private distanceToNextCheckpoint: Vector2;
    // -----
    public constructor() {
        this.lap = 1;
        this.totalTime = new Date(0);
        this.hasStartedAFirstLap = false;
        this.hasCrossedStartLineBackward = false;
        this.lapTimes = new Array<Date>();
        this.subscription = new Subscription();
        this.isGoingForward = true;
        this.checkpoints = new Array<Vector2>();
        this.precedentDistanceToNextCheckpoint = new Vector2(0);
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
        if (this.isGoingForward) {
            if (!this.hasCrossedStartLineBackward) {
                if (this.hasStartedAFirstLap) {
                    this.lapTimes.push(new Date(this.CurrentLapTime));
                    if (this.lap !== LAP_NUMBER ) {
                        this.lap++;
                    }
                } else {
                    this.hasStartedAFirstLap = true;
                }
            } else {
                this.hasCrossedStartLineBackward = false;
            }
        } else {
            this.hasCrossedStartLineBackward = true;
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

    private verifyWay(): void {
        const deltaDistance: number  = this.precedentDistanceToNextCheckpoint.length() - this.distanceToNextCheckpoint.length();
        this.isGoingForward = deltaDistance >= 0;
    }

    public updateDistanceToNextCheckpoint(meshPosition: Vector2): void {
        this.distanceToNextCheckpoint.subVectors(this.nextCheckpoint, meshPosition);
        this.verifyWay();
        this.precedentDistanceToNextCheckpoint = this.distanceToNextCheckpoint.clone();
        console.log(this.isGoingForward);
    }
}
