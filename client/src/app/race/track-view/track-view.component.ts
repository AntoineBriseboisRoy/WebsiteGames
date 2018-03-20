import { Component, OnInit } from "@angular/core";
import { ITrack } from "../../../../../common/interfaces/ITrack";
import { MongoQueryService } from "../../mongo-query.service";
import { TrackParserService } from "../track-parser.service";

@Component({
    selector: "app-track-view",
    templateUrl: "./track-view.component.html",
    styleUrls: ["./track-view.component.css"]
})
export class TrackViewComponent implements OnInit {
    public tracks: ITrack[];

    public readonly title: string;
    public constructor(private mongoQueryService: MongoQueryService, private trackParserService: TrackParserService) {
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
        })
        .catch((err: Error) => { console.error(err); }
        );
    }

    public parseTrack(track: ITrack): void {
        this.trackParserService.track = track;
    }
}
