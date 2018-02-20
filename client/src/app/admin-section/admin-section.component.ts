import { Component, OnInit } from "@angular/core";
import { TrackInfo } from "./track-info";

@Component({
    selector: "app-admin-section",
    templateUrl: "./admin-section.component.html",
    styleUrls: ["./admin-section.component.css"]
})
export class AdminSectionComponent implements OnInit {

    private tracks: TrackInfo[];
    private activeTrack: TrackInfo;

    public readonly title: string = "Welcome to the admistration section!";
    public constructor() {
        this.tracks = new Array<TrackInfo>();
        this.activeTrack = new TrackInfo("", "");
    }

    public ngOnInit(): void {
        this.createArtificialTracks();
    }

    public onClick(name: string, description: string): void {
        const selectedTrack: TrackInfo = this.tracks.find((track: TrackInfo) => {
            return track.Name === name;
        });
        if (selectedTrack) {
            this.activeTrack = selectedTrack;
        }
        alert("Can't yet edit " + name + " because the track editor is not implemented.");
    }

    private createArtificialTracks(): void {
        this.tracks.push(new TrackInfo("Laguna Seca", "A great American track with a corkscrew."));
        this.tracks.push(new TrackInfo("Monza", "The best Italian chicane."));
        this.tracks.push(new TrackInfo("Nürburgring Nordschleife", "Pure German madness."));
        this.tracks.push(new TrackInfo("La Sarthe", "24 hours of French adrenaline."));
        this.tracks.push(new TrackInfo("Monaco", "A street racing circuit."));
    }
}
