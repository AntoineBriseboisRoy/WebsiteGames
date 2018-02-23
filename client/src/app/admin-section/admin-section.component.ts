import { Component, OnInit } from "@angular/core";
import { Track } from "./track";

@Component({
    selector: "app-admin-section",
    templateUrl: "./admin-section.component.html",
    styleUrls: ["./admin-section.component.css"]
})
export class AdminSectionComponent implements OnInit {

    private tracks: Track[];
    private activeTrack: Track;

    public readonly title: string = "Welcome to the admistration section!";
    public constructor() {
        this.tracks = new Array<Track>();
        this.activeTrack = new Track("", "");
    }

    public ngOnInit(): void {
        this.createArtificialTracks();
    }

    private onClick(name: string, action: string): void {
        const selectedTrack: Track = this.tracks.find((track: Track) => {
            return track.Name === name;
        });
        if (selectedTrack) {
            this.activeTrack = selectedTrack;
        }
        alert("Can't yet " + action + " \"" + name + "\" because the track editor is not implemented.");
    }

    private createArtificialTracks(): void {
        this.tracks.push(new Track("Laguna Seca", "A great American track with a corkscrew."));
        this.tracks.push(new Track("Monza", "The best Italian chicane."));
        this.tracks.push(new Track("Nürburgring Nordschleife", "Pure German madness."));
        this.tracks.push(new Track("La Sarthe", "24 hours of French adrenaline."));
        this.tracks.push(new Track("Monaco", "A street racing circuit."));
    }
}
