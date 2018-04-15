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
    private checkpoints: Array<[Vector2, Vector2]>;
    public nextCheckpoint: [Vector2, Vector2];
    private precedentDistanceToNextCheckpoint: number;
    private distanceToNextCheckpoint: number;
    // -----
    public constructor() {
        this.lap = 1;
        this.totalTime = new Date(0);
        this.hasStartedAFirstLap = false;
        this.hasCrossedStartLineBackward = false;
        this.lapTimes = new Array<Date>();
        this.subscription = new Subscription();
        this.isGoingForward = true;
        this.checkpoints = new Array<[Vector2, Vector2]>();
        this.precedentDistanceToNextCheckpoint = 0;
        this.distanceToNextCheckpoint = 0;
        this.nextCheckpoint = [new Vector2(), new Vector2()];
    }

    public get Lap(): number {
        return this.lap;
    }

    public get CurrentLapTime(): number {
        return this.totalTime.getTime() - this.lapTimes.reduce((a, b) => a + b.getTime(), 0);
    }

    // TODO: Add checkpoint mesh position for AI
    public addCheckpoint( checkpointPosition: Vector2, checkpointSegment: [Vector2, Vector2]): void {
        this.checkpoints.push(checkpointSegment);
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
        console.log(this.nextCheckpoint);
        this.nextCheckpoint = this.checkpoints[checkpoint];
        console.log("----------------------");
        console.log("PROCHAIN CHECKPOINT: " + checkpoint);
        console.log("----------------------");
    }

    private verifyWay(): void {
        const deltaDistance: number  = this.precedentDistanceToNextCheckpoint - this.distanceToNextCheckpoint;
        this.isGoingForward = deltaDistance >= 0;
    }

    private shortestDistanceFromCarToCheckpoint(carMeshPosition: Vector2): number {
        return Math.abs((this.nextCheckpoint[1].y - this.nextCheckpoint[0].y) * carMeshPosition.x -
                        (this.nextCheckpoint[1].x - this.nextCheckpoint[0].x) * carMeshPosition.y +
                        this.nextCheckpoint[1].x * this.nextCheckpoint[0].y - this.nextCheckpoint[1].y * this.nextCheckpoint[0].x) /
                        new Vector2().subVectors(this.nextCheckpoint[1], this.nextCheckpoint[0]).length();
    }

    public updateDistanceToNextCheckpoint(carMeshPosition: Vector2): void {
        this.distanceToNextCheckpoint = this.shortestDistanceFromCarToCheckpoint(carMeshPosition);
        this.verifyWay();
        this.precedentDistanceToNextCheckpoint = this.distanceToNextCheckpoint;
        console.log(this.distanceToNextCheckpoint);
        console.log(this.isGoingForward);
    }
}
