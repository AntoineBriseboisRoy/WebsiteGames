import { Subscription } from "rxjs/Subscription";
import { LAP_NUMBER } from "../../constants";
import { Vector2 } from "three";

export class CarInformation {
    private lap: number;
    private lapTimes: Array<Date>;
    public totalTime: Date;
    private isGoingForward: boolean;
    private hasStartedAFirstLap: boolean;
    private hasCrossedStartLineBackward: boolean;
    private subscription: Subscription;

    // For AI :
    private checkpoints: Array<[Vector2, Vector2]>;
    public nextCheckpoint: number;
    private precedentDistanceToNextCheckpoint: number;
    private distanceToNextCheckpoint: number;
    // -----
    public constructor() {
        this.lap = 1;
        this.lapTimes = new Array<Date>();
        this.totalTime = new Date(0);
        this.isGoingForward = true;
        this.hasStartedAFirstLap = false;
        this.hasCrossedStartLineBackward = false;
        this.subscription = new Subscription();
        this.checkpoints = new Array<[Vector2, Vector2]>();
        this.precedentDistanceToNextCheckpoint = 0;
        this.distanceToNextCheckpoint = 0;
        this.nextCheckpoint = 1;
    }

    public get Lap(): number {
        return this.lap;
    }

    public get CurrentLapTime(): number {
        return this.totalTime.getTime() - this.lapTimes.reduce((a, b) => a + b.getTime(), 0);
    }

    public get DistanceToNextCheckpoint(): number {
        return this.distanceToNextCheckpoint;
    }

    public get Checkpoints(): Array<[Vector2, Vector2]> {
        return this.checkpoints;
    }

    public addCheckpoint( checkpoint: [Vector2, Vector2]): void {
        this.checkpoints.push(checkpoint);
    }

    public completeALap(): void {
        if (this.isGoingForward) {
            if (!this.hasCrossedStartLineBackward) {
                if (this.hasStartedAFirstLap) {
                    this.incrementLap();
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

    private incrementLap(): void {
        this.lapTimes.push(new Date(this.CurrentLapTime));
        if (this.lap !== LAP_NUMBER) {
            this.lap++;
        }
    }

    public startTimer(subscription: Subscription): void {
        this.subscription = subscription;
    }

    public stopTimer(): void {
        this.subscription.unsubscribe();
    }

    public setNextCheckpoint( checkpoint: number ): void {
        this.nextCheckpoint = this.nextCheckpoint === checkpoint ?
                              (checkpoint + 1) % this.checkpoints.length : checkpoint;

        console.log("----------------------");
        console.log("PROCHAIN CHECKPOINT: " + "\nLeft: " + this.checkpoints[this.nextCheckpoint][0].toArray() +
                    "\nRight: " + this.checkpoints[this.nextCheckpoint][1].toArray() + "\nDirection: " + this.isGoingForward);
        console.log("----------------------");
    }

    private verifyWay(): void {
        const deltaDistance: number  = this.precedentDistanceToNextCheckpoint - this.distanceToNextCheckpoint;
        this.isGoingForward = deltaDistance >= 0;
    }

    private shortestDistanceFromCarToCheckpoint(carMeshPosition: Vector2): number {
        return Math.abs((this.checkpoints[this.nextCheckpoint][1].y - this.checkpoints[this.nextCheckpoint][0].y) * carMeshPosition.x -
                        (this.checkpoints[this.nextCheckpoint][1].x - this.checkpoints[this.nextCheckpoint][0].x) * carMeshPosition.y +
                        this.checkpoints[this.nextCheckpoint][1].x * this.checkpoints[this.nextCheckpoint][0].y -
                        this.checkpoints[this.nextCheckpoint][1].y * this.checkpoints[this.nextCheckpoint][0].x) /
                        new Vector2().subVectors(this.checkpoints[this.nextCheckpoint][1],
                                                 this.checkpoints[this.nextCheckpoint][0]).length();
    }

    public updateDistanceToNextCheckpoint(carMeshPosition: Vector2): void {
        this.distanceToNextCheckpoint = this.shortestDistanceFromCarToCheckpoint(carMeshPosition);
        this.verifyWay();
        this.precedentDistanceToNextCheckpoint = this.distanceToNextCheckpoint;
    }
}
