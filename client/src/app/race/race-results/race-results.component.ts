import { Component, OnInit } from "@angular/core";
import { CarInformation } from "../car/car-information";
import { RenderService } from "../render-service/render.service";
import { Car } from "../car/car";
import { MongoQueryService } from "../../mongo-query.service";
import { ITrack, BestTime } from "../../../../../common/interfaces/ITrack";

const N_BEST_TIMES: number = 5;
const PLAYER_INDEX: number = 0;

@Component({
    selector: "app-race-results",
    templateUrl: "./race-results.component.html",
    styleUrls: ["./race-results.component.css"]
})
export class RaceResultsComponent implements OnInit {
    private carInformations: CarInformation[];
    private trackBestTimes: BestTime[];

    public get CarInformations(): CarInformation[] {
        return this.carInformations;
    }

    public get TrackBestTimes(): BestTime[] {
        return this.trackBestTimes;
    }

    public constructor(private renderService: RenderService, private queryService: MongoQueryService) {
        this.carInformations = new Array<CarInformation>();
        this.trackBestTimes = new Array<BestTime>();
    }

    public ngOnInit(): void {
        this.getSortedCarInformations();
        this.getTrackBestTimes();
    }

    private getSortedCarInformations(): void {
        this.renderService.Cars.forEach((car: Car) => this.carInformations.push(car.Information));
        this.sortRaceTimes();
    }

    private sortRaceTimes(): void {
        this.carInformations = this.carInformations.sort((a: CarInformation, b: CarInformation) => {
            if (a.totalTime < b.totalTime) {
                return 1;
            } else if (b.totalTime < a.totalTime) {
                return -1;
            } else {
                return 0;
            }
        });
    }

    private verifyBestTime(): void {
        if (this.carInformations[PLAYER_INDEX].Ranking === 1) {
            this.trackBestTimes.push({playerName: "Samuel", time: this.carInformations[PLAYER_INDEX].totalTime});
            this.trackBestTimes.sort((a: BestTime, b: BestTime) => {
                if (a.time < b.time) {
                    return -1;
                } else if (b.time < a.time) {
                    return 1;
                } else {
                    return 0;
                }
            });
            if (this.trackBestTimes.length > N_BEST_TIMES) {
                this.trackBestTimes.pop();
            }
        }
        this.renderService.ActiveTrack.bestTimes = this.TrackBestTimes;
        this.editTrackBestTimesDB();
    }

    private getTrackBestTimes(): void {
        this.queryService.getTrack(this.renderService.ActiveTrack.name)
            .then((track: ITrack) => {
                track.bestTimes.slice(0, N_BEST_TIMES).forEach((bestTime: BestTime) => {
                    this.trackBestTimes.push({playerName: bestTime.playerName, time: new Date(bestTime.time)}); });

                this.verifyBestTime();
            })
            .catch((error: Error) => console.error(error));
    }

    public getFormattedTime(time: Date): string {
        const PADDING: number = 2;

        return time.getMinutes().toString().padStart(PADDING, "0") + ":" +
               time.getSeconds().toString().padStart(PADDING, "0") + ":"  +
               time.getMilliseconds().toString().padEnd(PADDING, "0").substr(0, PADDING);
    }

    private editTrackBestTimesDB(): void {
        this.queryService.putTrack(this.renderService.ActiveTrack.name, this.renderService.ActiveTrack)
        .then()
        .catch((err: Error) => { console.error(err); }
        );
    }
}
