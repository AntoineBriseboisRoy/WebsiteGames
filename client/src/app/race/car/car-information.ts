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
    private hasEndRace: boolean;
    private subscription: Subscription;
    private checkpoints: Array<[Vector2, Vector2]>;
    private intersectionPositions: Array<Vector2>;
    public nextCheckpoint: number;
    private precedentDistanceToNextCheckpoint: number;
    private distanceToNextCheckpoint: number;
    private checkpointCounter: number;
    public constructor() {
        this.lap = 1;
        this.lapTimes = new Array<Date>();
        this.totalTime = new Date(0);
        this.isGoingForward = true;
        this.hasStartedAFirstLap = false;
        this.hasCrossedStartLineBackward = false;
        this.hasEndRace = false;
        this.subscription = new Subscription();
        this.checkpoints = new Array<[Vector2, Vector2]>();
        this.intersectionPositions = new Array<Vector2>();
        this.precedentDistanceToNextCheckpoint = 0;
        this.distanceToNextCheckpoint = 0;
        this.nextCheckpoint = 1;
        this.checkpointCounter = 0;
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

    public get IntersectionPositions(): Array<Vector2> {
        return this.intersectionPositions;
    }

    public get HasEndRace(): boolean {
        return this.hasEndRace;
    }

    public get CheckpointCounter(): number {
        return this.checkpointCounter;
    }

    public addIntersectionPosition ( intersection: Vector2 ): void {
        this.intersectionPositions.push(intersection);
    }

    public addCheckpoint( checkpoint: [Vector2, Vector2]): void {
        this.checkpoints.push(checkpoint);
    }

    public completeALap(): void {
        if (this.isGoingForward) {
            if (!this.hasCrossedStartLineBackward) {
                if (this.hasStartedAFirstLap) {
                    if (!this.hasEndRace) {
                        this.incrementLap();
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

    private incrementLap(): void {
        this.lapTimes.push(new Date(this.CurrentLapTime));
        if (this.lap === LAP_NUMBER) {
            this.hasEndRace = true;
        } else {
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
        if (this.nextCheckpoint === checkpoint) {
            this.nextCheckpoint = (checkpoint + 1) % this.checkpoints.length;
            this.checkpointCounter++;
        } else {
            this.nextCheckpoint = checkpoint;
            this.checkpointCounter--;
        }
    }

    private verifyWay(): void {
        const deltaDistance: number  = this.precedentDistanceToNextCheckpoint - this.distanceToNextCheckpoint;
        this.isGoingForward = deltaDistance >= 0;
    }

    private shortestDistanceFromCarToCheckpoint(carMeshPosition: Vector2): number {
        const checkpointVector: Vector2 = new Vector2().subVectors(this.checkpoints[this.nextCheckpoint][1],
                                                                   this.checkpoints[this.nextCheckpoint][0]);

        return Math.abs((checkpointVector.y) * carMeshPosition.x -
                        (checkpointVector.x) * carMeshPosition.y +
                        this.checkpoints[this.nextCheckpoint][1].x * this.checkpoints[this.nextCheckpoint][0].y -
                        this.checkpoints[this.nextCheckpoint][1].y * this.checkpoints[this.nextCheckpoint][0].x) /
                        checkpointVector.length();
    }

    public trackLengthToCheckpoint(checkpoint: number): number {
        let trackLength: number = 0;
        for (let i: number = 0; i < checkpoint; i++ ) {
            trackLength += new Vector2().subVectors(this.intersectionPositions[(i + 1) % this.intersectionPositions.length],
                                                    this.intersectionPositions[i]).length();
        }

        return trackLength;
    }

    public updateDistanceToNextCheckpoint(carMeshPosition: Vector2): void {
        this.distanceToNextCheckpoint = this.shortestDistanceFromCarToCheckpoint(carMeshPosition);
        this.verifyWay();
        this.precedentDistanceToNextCheckpoint = this.distanceToNextCheckpoint;
    }
}
