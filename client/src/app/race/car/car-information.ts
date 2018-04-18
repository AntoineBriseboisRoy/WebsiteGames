import { Subscription } from "rxjs/Subscription";
import { LAP_NUMBER } from "../../constants";
import { Vector2 } from "three";
import { ILapInformation, ICheckpointInformation } from "../../interfaces";

export class CarInformation {
    private lapInformation: ILapInformation;
    private checkpointInformation: ICheckpointInformation;
    private hasStartedAFirstLap: boolean;
    private hasCrossedStartLineBackward: boolean;
    private hasEndRace: boolean;
    private timerSubscription: Subscription;
    private intersectionPositions: Array<Vector2>;
    public constructor() {
        this.lapInformation = {lap: 1, lapTimes: new Array<Date>(), totalTime: new Date(0)} as ILapInformation;
        this.checkpointInformation = {checkpoints: new Array<[Vector2, Vector2]>(), nextCheckpoint: 1, precedentDistanceToNextCheckpoint: 0,
                                      distanceToNextCheckpoint: 0, isGoingForward: true, checkpointCounter: 0} as ICheckpointInformation;
        this.hasStartedAFirstLap = false;
        this.hasCrossedStartLineBackward = false;
        this.hasEndRace = false;
        this.timerSubscription = new Subscription();
        this.intersectionPositions = new Array<Vector2>();
    }

    public get Lap(): number {
        return this.lapInformation.lap;
    }

    public get CurrentLapTime(): number {
        return this.lapInformation.totalTime.getTime() - this.lapInformation.lapTimes.reduce((a, b) => a + b.getTime(), 0);
    }

    public get TotalTime(): Date {
        return this.lapInformation.totalTime;
    }

    public get DistanceToNextCheckpoint(): number {
        return this.checkpointInformation.distanceToNextCheckpoint;
    }

    public get Checkpoints(): Array<[Vector2, Vector2]> {
        return this.checkpointInformation.checkpoints;
    }

    public get IntersectionPositions(): Array<Vector2> {
        return this.intersectionPositions;
    }

    public get HasEndRace(): boolean {
        return this.hasEndRace;
    }

    public get CheckpointCounter(): number {
        return this.checkpointInformation.checkpointCounter;
    }

    public get NextCheckpoint(): number {
        return this.checkpointInformation.nextCheckpoint;
    }

    public addIntersectionPosition ( intersection: Vector2 ): void {
        this.intersectionPositions.push(intersection);
    }

    public addCheckpoint( checkpoint: [Vector2, Vector2]): void {
        this.Checkpoints.push(checkpoint);
    }

    public setNextCheckpoint( checkpoint: number ): void {
        if (this.NextCheckpoint === checkpoint) {
            this.checkpointInformation.nextCheckpoint = (checkpoint + 1) % this.Checkpoints.length;
            this.checkpointInformation.checkpointCounter++;
        } else {
            this.checkpointInformation.nextCheckpoint = checkpoint;
            this.checkpointInformation.checkpointCounter--;
        }
    }

    public startTimer(subscription: Subscription): void {
        this.timerSubscription = subscription;
    }

    public stopTimer(): void {
        this.timerSubscription.unsubscribe();
    }

    public completeALap(): void {
        if (this.checkpointInformation.isGoingForward) {
            if (!this.hasCrossedStartLineBackward) {
                if (this.hasStartedAFirstLap) {
                    if (!this.hasEndRace) {
                        console.log(this.hasCrossedStartLineBackward);
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

    public updateDistanceToNextCheckpoint(carMeshPosition: Vector2): void {
        this.checkpointInformation.distanceToNextCheckpoint = this.shortestDistanceFromCarToCheckpoint(carMeshPosition);
        this.verifyWay();
        this.checkpointInformation.precedentDistanceToNextCheckpoint = this.DistanceToNextCheckpoint;
    }

    private incrementLap(): void {
        this.lapInformation.lapTimes.push(new Date(this.CurrentLapTime));
        if (this.lapInformation.lap === LAP_NUMBER) {
            this.hasEndRace = true;
        } else {
            this.lapInformation.lap++;
        }
    }

    private shortestDistanceFromCarToCheckpoint(carMeshPosition: Vector2): number {
        const checkpointVector: Vector2 = new Vector2().subVectors(this.checkpointInformation.checkpoints[
                                                                    this.NextCheckpoint][1],
                                                                   this.checkpointInformation.checkpoints[
                                                                       this.NextCheckpoint][0]);

        return Math.abs((checkpointVector.y) * carMeshPosition.x - (checkpointVector.x) * carMeshPosition.y +
                        this.Checkpoints[this.NextCheckpoint][1].x * this.Checkpoints[this.NextCheckpoint][0].y -
                        this.Checkpoints[this.NextCheckpoint][1].y * this.Checkpoints[this.NextCheckpoint][0].x) /
                             checkpointVector.length();
    }

    private verifyWay(): void {
        const deltaDistance: number  = this.checkpointInformation.precedentDistanceToNextCheckpoint - this.DistanceToNextCheckpoint;
        this.checkpointInformation.isGoingForward = deltaDistance >= 0;
    }
}
