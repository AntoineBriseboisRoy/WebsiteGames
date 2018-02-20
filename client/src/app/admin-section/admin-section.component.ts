import { Component, OnInit } from "@angular/core";
import { TrackInfo } from "./track-info";

@Component({
    selector: "app-admin-section",
    templateUrl: "./admin-section.component.html",
    styleUrls: ["./admin-section.component.css"]
})
export class AdminSectionComponent implements OnInit {

    private tracks: TrackInfo[];

    public readonly title: string = "Welcome to the admistration section!";
    public constructor() {
        this.tracks = new Array<TrackInfo>();
    }

    public ngOnInit(): void {
        this.createArtificialTracks();
    }

    private createArtificialTracks(): void {
        this.tracks.push(new TrackInfo("Laguna Seca", "A great American track with a corkscrew."));
        this.tracks.push(new TrackInfo("Monza", "The best Italian chicane."));
        this.tracks.push(new TrackInfo("Nürburgring Nordschleife", "Pure German madness."));
        this.tracks.push(new TrackInfo("La Sarthe", "24 hours of French adrenaline."));
        this.tracks.push(new TrackInfo("Monaco", "A street racing circuit."));
    }
}
