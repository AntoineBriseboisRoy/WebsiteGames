import { Component, OnInit } from "@angular/core";
import { ITrack } from "../../../../../common/interfaces/ITrack";
import { MongoQueryService } from "../../mongo-query.service";
import { ModalService } from "../../modal/modal.service";
import { ModalOptions } from "../../modal/interfaces";
import { Router, Params, ActivatedRoute } from "@angular/router";
import { DateFormatter } from "../date-formatter";

@Component({
    selector: "app-track-view",
    templateUrl: "./track-view.component.html",
    styleUrls: ["./track-view.component.css"]
})
export class TrackViewComponent implements OnInit {
    public tracks: ITrack[];

    public readonly title: string;
    public constructor(private mongoQueryService: MongoQueryService, private route: ActivatedRoute,
                       private modalService: ModalService, private router: Router) {
        this.title = "Welcome to track list!";
        this.tracks = new Array<ITrack>();
    }

    public ngOnInit(): void {
        this.getAllTracks();
    }

    private getAllTracks(): void {
        this.mongoQueryService.getAllTracks()
        .then((tracks: Array<ITrack>) => {
            this.tracks = tracks;

            this.tracks.forEach((track: ITrack) => {
                for (let i: number = 0; i < track.bestTimes.length; i++) {
                    track.bestTimes[i] = {playerName: track.bestTimes[i].playerName, time: new Date(track.bestTimes[i].time)};
                }
            });
        })
        .catch((err: Error) => { console.error(err); }
        );
    }

    public getFormattedTime(time: Date): string {
        return DateFormatter.DateToMinSecMillisec(new Date(time));
    }

    public callModal(): void {
        this.modalService.open({
            title: "Race preview", message: "Are you sure you want to play this track?\n",
            firstButton: "Play", secondButton: "Cancel", showPreview: true
        } as ModalOptions)
            .then(() => {
                this.route.queryParams.subscribe((params: Params) => {
                    this.router.navigate(["/race/play/"], { queryParams: { name: params["name"]}});
                });
            },
                  () => { }
            );
    }
}
