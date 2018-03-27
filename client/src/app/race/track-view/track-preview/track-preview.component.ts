import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { MongoQueryService } from "../../../mongo-query.service";
import { ITrack } from "../../../../../../common/interfaces/ITrack";
import { Point } from "../../edit-track/Geometry";
import { TRACK_WIDTH, DEFAULT_CIRCLE_RADIUS, FULL_CIRCLE_RAD, DEFAULT_LINE_WIDTH } from "../../../constants";

const ARC_DIVISION_FACTOR: number = 5;
@Component({
  selector: "app-track-preview",
  templateUrl: "./track-preview.component.html",
  styleUrls: ["./track-preview.component.css"]
})
export class TrackPreviewComponent implements OnInit {

  @ViewChild("mycanvas")
  private canvas: ElementRef;
  private context: CanvasRenderingContext2D;

  private get Canvas(): HTMLCanvasElement {
    return this.canvas.nativeElement as HTMLCanvasElement;
  }

  public constructor(private route: ActivatedRoute, private mongoQueryService: MongoQueryService) {

  }

  public ngOnInit(): void {
    this.context = this.Canvas.getContext("2d");

    this.route.queryParams.subscribe((params: Params) => {
      this.mongoQueryService.getTrack(params["name"]).then((track: ITrack) => {
        this.drawPreview(track.points);
      }).catch((err) => console.error(err));
    });
  }

  private drawPreview(points: Point[]): void {
    this.context.beginPath();
    this.context.strokeStyle = "black";
    this.context.fillStyle = "black";

    for (let i: number = 0; i < points.length - 1; ++i) {
      this.context.beginPath();
      // tslint:disable-next-line:no-magic-numbers
      this.context.lineWidth = TRACK_WIDTH / 2;
      this.context.moveTo(points[i].x * this.Canvas.getBoundingClientRect().width,
                          points[i].y * this.Canvas.getBoundingClientRect().height);
      this.context.lineTo(points[i + 1].x * this.Canvas.getBoundingClientRect().width,
                          points[i + 1].y * this.Canvas.getBoundingClientRect().height);
      this.context.stroke();
      this.context.closePath();

      this.context.beginPath();
      this.context.lineWidth = DEFAULT_LINE_WIDTH;
      this.context.arc(points[i].x * this.Canvas.getBoundingClientRect().width,
                       points[i].y * this.Canvas.getBoundingClientRect().height,
                       DEFAULT_CIRCLE_RADIUS / ARC_DIVISION_FACTOR, 0, FULL_CIRCLE_RAD, false);
      this.context.stroke();
      this.context.fill();
      this.context.closePath();
    }
  }
}
