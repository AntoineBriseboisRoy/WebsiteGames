import { Injectable } from "@angular/core";
import { Car } from "../car/car";

@Injectable()
export class RankingService {
    private ranking: Array<Car>;
    private player: Car;

    public constructor() {
        this.ranking = new Array<Car>();
        this.player = new Car();
    }

    public initializeRanking(cars: Array<Car>): void {
        this.player = cars[0];
        this.ranking = cars.slice();
    }

    public playerRanking(): number {
        this.ranking.sort((a, b) => this.sortRanking(a, b) );

        return this.playerIndexInRanking(this.player, this.ranking);
    }

    private sortRanking( a: Car, b: Car): number {
        if (a.Information.HasEndRace && !b.Information.HasEndRace) {
            return -1;
        } else if (!a.Information.HasEndRace && b.Information.HasEndRace) {
            return 1;
        } else if (a.Information.HasEndRace && b.Information.HasEndRace) {
            return this.sortByTotalTime(a, b);
        }

        return this.sortByTraveledDistance(a, b);
    }

    private sortByTotalTime(a: Car, b: Car): number {
        return a.Information.totalTime.getTime() - b.Information.totalTime.getTime();
    }

    private sortByTraveledDistance(a: Car, b: Car): number {
        if (a.Information.Lap === b.Information.Lap) {
            if (a.Information.nextCheckpoint === b.Information.nextCheckpoint) {
                return this.sortByDistanceToNextCheckpoint(a, b);
            } else {
                return this.sortByCheckpoint(a, b);
            }
        }

        return this.sortByLap(a, b);
    }

    private sortByDistanceToNextCheckpoint(a: Car, b: Car): number {
        return a.Information.DistanceToNextCheckpoint - b.Information.DistanceToNextCheckpoint;
    }

    private sortByCheckpoint(a: Car, b: Car): number {
        return b.Information.CheckpointCounter - a.Information.CheckpointCounter;
    }

    private sortByLap(a: Car, b: Car): number {
        return b.Information.Lap - a.Information.Lap;
    }
    private playerIndexInRanking( player: Car, ranking: Array<Car> ): number {
        for (let i: number = 0; i < ranking.length; i++) {
            if (player === ranking[i]) {
                return i + 1;
            }
        }

        return -1;
    }

}
