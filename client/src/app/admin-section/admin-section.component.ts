import { Component, OnInit } from "@angular/core";
import { Track, TrackType } from "./track";
import { MongoQueryService } from "../mongo-query.service";

@Component({
    selector: "app-admin-section",
    templateUrl: "./admin-section.component.html",
    styleUrls: ["./admin-section.component.css"]
})
export class AdminSectionComponent implements OnInit {

    private tracks: Track[];
    private activeTrack: Track;

    public readonly title: string;
    public constructor(private mongoQueryService: MongoQueryService) {
        this.tracks = new Array<Track>();
        this.activeTrack = new Track("", "", 0, ["0:00"], TrackType.DESERT);
        this.title = "Welcome to the admistration section!";
    }

    public ngOnInit(): void {
        this.createArtificialTracks();
    }

    public onButtonClick(name: string, action: string): void {
        const selectedTrack: Track = this.tracks.find((track: Track) => {
            return track.Name === name;
        });
        if (selectedTrack) {
            this.activeTrack = selectedTrack;
        }

        this.showNotImplementedMessage(action); // This will be replaced by a call to the track editor.
    }

    private showNotImplementedMessage(action: string): void {
        alert("Can't yet " + action + " \"" + this.activeTrack.Name + "\" because the track editor is not implemented.");
    }

    private createArtificialTracks(): void {

        console.log(this.mongoQueryService.getTrack());
        this.tracks.push(new Track("Laguna Seca", "A great American track with a corkscrew.", 0, ["0:00"], TrackType.DESERT));
        this.tracks.push(new Track("Monza", "The best Italian chicane.", 0, ["0:00"], TrackType.DESERT));
        this.tracks.push(new Track("Nürburgring Nordschleife", "Pure German madness.", 0, ["0:00"], TrackType.DESERT));
        this.tracks.push(new Track("La Sarthe", "24 hours of French adrenaline.", 0, ["0:00"], TrackType.DESERT));
        this.tracks.push(new Track("Monaco", "A street racing circuit.", 0, ["0:00"], TrackType.DESERT));

        this.mongoQueryService.postTrack(this.tracks[0]);
        // this.tracks.forEach((track: Track) => {
        //     this.mongoQueryService.postTrack(track)
        //     .then()
        //     .catch((err: Error) => { console.error(err); }
        //     );
        // });
    }
}
