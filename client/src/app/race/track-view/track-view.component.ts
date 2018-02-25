import { Component, OnInit } from "@angular/core";
import { Track, TrackType } from "../../admin-section/track";

@Component({
    selector: "app-track-view",
    templateUrl: "./track-view.component.html",
    styleUrls: ["./track-view.component.css"]
})
export class TrackViewComponent implements OnInit {
    private tracks: Track[];

    public readonly title: string = "Welcome to track list!";
    public constructor() {
        this.tracks = new Array<Track>();
    }

    public ngOnInit(): void {
        this.createArtificialTracks();
    }

    private createArtificialTracks(): void {
        this.tracks.push(new Track("Laguna Seca", "A great American track with a corkscrew.", 0,
                                   ["0:00", "0:00", "0:00"], TrackType.DESERT));
        this.tracks.push(new Track("Monza", "The best Italian chicane.", 0, ["0:00", "0:00", "0:00"], TrackType.DESERT));
        this.tracks.push(new Track("Nürburgring Nordschleife", "Pure German madness.", 0, ["0:00", "0:00", "0:00"], TrackType.DESERT));
        this.tracks.push(new Track("La Sarthe", "24 hours of French adrenaline.", 0, ["0:00", "0:00", "0:00"], TrackType.DESERT));
        this.tracks.push(new Track("Monaco", "A street racing circuit.", 0, ["0:00", "0:00", "0:00"], TrackType.DESERT));
    }
}
