import { Component, OnInit } from "@angular/core";
import { ITrack } from "../../../../../common/interfaces/ITrack";
import { MongoQueryService } from "../../mongo-query.service";

@Component({
    selector: "app-track-view",
    templateUrl: "./track-view.component.html",
    styleUrls: ["./track-view.component.css"]
})
export class TrackViewComponent implements OnInit {
    private tracks: ITrack[];

    public readonly title: string = "Welcome to track list!";
    public constructor(private mongoQueryService: MongoQueryService) {
        this.tracks = new Array<ITrack>();
    }

    public ngOnInit(): void {
        this.getAllTracks();
    }

    private getAllTracks(): void {
        this.mongoQueryService.getAllTracks()
        .then((tracks: Array<ITrack>) => {
            this.tracks = tracks;
        })
        .catch((err: Error) => { console.error(err); }
        );
    }
}
