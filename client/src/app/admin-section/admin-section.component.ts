import { Component, OnInit } from "@angular/core";
import { ITrack, TrackType } from "./../../../../common/interfaces/ITrack";
import { MongoQueryService } from "../mongo-query.service";

@Component({
    selector: "app-admin-section",
    templateUrl: "./admin-section.component.html",
    styleUrls: ["./admin-section.component.css"]
})
export class AdminSectionComponent implements OnInit {

    private tracks: ITrack[];
    private activeTrack: ITrack;

    public readonly title: string;
    public constructor(private mongoQueryService: MongoQueryService) {
        this.tracks = new Array<ITrack>();
        this.activeTrack = { _id: "", name: "", description: "", nTimesPlayed: 0, bestTimes: ["0:00"], type: TrackType.DESERT } as ITrack;
        this.title = "Welcome to the admistration section!";
    }

    public ngOnInit(): void {
        this.getITracksFromServer();
    }

    public onButtonClick(name: string, action: string): void {
        const selectedTrack: ITrack = this.tracks.find((track: ITrack) => {
            return track.name === name;
        });
        if (selectedTrack) {
            this.activeTrack = selectedTrack;
        }

        this.showNotImplementedMessage(action); // This will be replaced by a call to the ITrack editor.
    }

    private showNotImplementedMessage(action: string): void {
        alert("Can't yet " + action + " \"" + this.activeTrack.name + "\" because the ITrack editor is not implemented.");
    }

    private getITracksFromServer(): void {
        this.mongoQueryService.getAllTracks()
            .then((tracks: Array<ITrack>) => {
                this.tracks = tracks;
            })
            .catch((err: Error) => { console.error(err); });
    }
}
