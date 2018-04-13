import { Subscription } from "rxjs/Subscription";
import { LAP_NUMBER } from "../../constants";
import { Vector2 } from "three";
import { ITrack } from "../../../../../common/interfaces/ITrack";

export class CarInformation {
    private lap: number;
    public totalTime: Date;
    public way: boolean;
    private hasStartedAFirstLap: boolean;
    private lapTimes: Array<Date>;
    private subscription: Subscription;
    private distanceToNextCheckpoint: number;
    private activeTrack: ITrack;
    public nextCheckpoint: number;
    private ranking: number;
    private playerName: string;

    public constructor() {
        this.lap = 1;
        this.totalTime = new Date(0);
        this.hasStartedAFirstLap = false;
        this.lapTimes = new Array<Date>();
        this.subscription = new Subscription();
        this.way = true;
        this.distanceToNextCheckpoint = 0;
        this.nextCheckpoint = 0;
        this.ranking = 1;
        this.activeTrack = {} as ITrack;
    }

    public get PlayerName(): string {
        return this.playerName;
    }

    public get Lap(): number {
        return this.lap;
    }

    public get Ranking(): number {
        return this.ranking;
    }
    public get CurrentLapTime(): number {
        return this.totalTime.getTime() - this.lapTimes.reduce((a, b) => a + b.getTime(), 0);
    }

    public set ActiveTrack(track: ITrack) {
        this.activeTrack = track;
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

    public updateNextCheckpoint( checkpoint: number ): void {
        console.log(checkpoint);
    }

    private updateDistanceToNextCheckpoint(carPosition: Vector2): void {
        const distance: Vector2 = new Vector2(this.activeTrack.points[this.nextCheckpoint].x - carPosition.x,
                                              this.activeTrack.points[this.nextCheckpoint].y - carPosition.y);
        this.distanceToNextCheckpoint = distance.length();
    }

    private updateRanking(): void {
    }

    public update(carPosition: Vector2): void {
        this.updateDistanceToNextCheckpoint(carPosition);
        this.updateRanking();
    }
}
