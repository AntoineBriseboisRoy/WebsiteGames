import { Component, OnInit } from "@angular/core";
import { ITrack } from "./../../../../common/interfaces/ITrack";
import { MongoQueryService } from "../mongo-query.service";

@Component({
    selector: "app-admin-section",
    templateUrl: "./admin-section.component.html",
    styleUrls: ["./admin-section.component.css"]
})
export class AdminSectionComponent implements OnInit {

    private tracks: ITrack[];
    public readonly title: string;
    public constructor(private mongoQueryService: MongoQueryService) {
        this.tracks = new Array<ITrack>();
        this.title = "Welcome to the admistration section!";
    }

    public ngOnInit(): void {
        this.getITracksFromServer();
    }

    public refreshITrackList(): void {
        this.getITracksFromServer();
    }

    public deleteTrack(name: string): void {
        this.mongoQueryService.deleteTrack(name).then(() => {
            this.getITracksFromServer();
        }).catch((error: Error) => {
            console.error(error);
        });
    }

    private getITracksFromServer(): void {
        this.mongoQueryService.getAllTracks()
            .then((tracks: Array<ITrack>) => {
                this.tracks = tracks;
            })
            .catch((err: Error) => { console.error(err); });
    }
}
