import { Component, OnInit } from "@angular/core";
import { CarInformation } from "../car/car-information";
import { RenderService } from "../render-service/render.service";
import { Car } from "../car/car";
import { MongoQueryService } from "../../mongo-query.service";
import { ITrack, BestTime } from "../../../../../common/interfaces/ITrack";
import { DateFormatter } from "../date-formatter";

const N_BEST_TIMES: number = 5;
const PLAYER_INDEX: number = 0;
const PLAYER_NAME_PLACEHOLDER: string = "";
const ANONYMOUS_PLAYER_NAME: string = "[Anonymous Player]";

@Component({
    selector: "app-race-results",
    templateUrl: "./race-results.component.html",
    styleUrls: ["./race-results.component.css"]
})
export class RaceResultsComponent implements OnInit {
    private carInformations: CarInformation[];
    private trackBestTimes: BestTime[];
    private bestTimeRanking: number;
    private hasSavedName: boolean;

    private isInBestTimes: boolean;

    public get CarInformations(): CarInformation[] {
        return this.carInformations;
    }

    public get TrackBestTimes(): BestTime[] {
        return this.trackBestTimes;
    }

    public get BestTimeRanking(): number {
        return this.bestTimeRanking;
    }

    public get HasSavedName(): boolean {
        return this.hasSavedName;
    }

    public constructor(private renderService: RenderService, private queryService: MongoQueryService) {
        this.carInformations = new Array<CarInformation>();
        this.trackBestTimes = new Array<BestTime>();
        this.bestTimeRanking = 0;
        this.isInBestTimes = false;
        this.hasSavedName = false;
    }

    public ngOnInit(): void {
        this.sortCarInformations();
        this.getTrackBestTimes();
    }

    public replay(): void {
        window.open("/race/play?name=" + this.renderService.ActiveTrack.name, "_self");
    }

    public goBackHome(): void {
        window.open("/", "_self");
    }

    public goBackTracks(): void {
        window.open("/race/", "_self");
    }

    public getFormattedTime(time: Date): string {
        return DateFormatter.DateToMinSecMillisec(time);
    }

    public editTrackBestTimesDB(): void {
        if (this.renderService.ActiveTrack.bestTimes[this.bestTimeRanking].playerName === PLAYER_NAME_PLACEHOLDER) {
            this.renderService.ActiveTrack.bestTimes[this.bestTimeRanking].playerName = ANONYMOUS_PLAYER_NAME;
        }
        this.queryService.putTrack(this.renderService.ActiveTrack.name, this.renderService.ActiveTrack)
        .then(() => this.hasSavedName = true)
        .catch((err: Error) => { console.error(err); });
    }

    private sortCarInformations(): void {
        this.renderService.Cars.forEach((car: Car) => this.carInformations.push(car.Information));
        this.sortRaceTimes();
    }

    private sortRaceTimes(): void {
        this.carInformations = this.carInformations.sort((a: CarInformation, b: CarInformation) => {
            if (a.totalTime < b.totalTime) {
                return -1;
            } else if (b.totalTime < a.totalTime) {
                return 1;
            } else {
                return 1;
            }
        });
    }

    private verifyBestTime(): void {
        if (this.carInformations[PLAYER_INDEX].Ranking === 1) {
            this.trackBestTimes.push({playerName: PLAYER_NAME_PLACEHOLDER, time: this.carInformations[PLAYER_INDEX].totalTime});
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
            this.inBestTimes();
            this.findPlayerRank();
        }
        this.renderService.ActiveTrack.bestTimes = this.TrackBestTimes;
        this.renderService.ActiveTrack.nTimesPlayed++;
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

    private inBestTimes(): void {
        this.isInBestTimes = this.carInformations[PLAYER_INDEX].totalTime <= this.trackBestTimes[this.trackBestTimes.length - 1].time;
    }

    private findPlayerRank(): void {
        if (this.isInBestTimes) {
            this.bestTimeRanking = this.trackBestTimes.findIndex((bestTime: BestTime) =>
                bestTime.playerName === PLAYER_NAME_PLACEHOLDER
                && bestTime.time === this.carInformations[PLAYER_INDEX].totalTime);
        }
    }
}
