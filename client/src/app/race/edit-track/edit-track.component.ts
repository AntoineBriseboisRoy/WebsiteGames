import { Component, OnInit } from "@angular/core";
import * as cst from "../../constants";

@Component({
  selector: "app-edit-track",
  templateUrl: "./edit-track.component.html",
  styleUrls: ["./edit-track.component.css"]
})
export class EditTrackComponent implements OnInit {

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private points: { x: number, y: number }[];

  public constructor() { }

  public ngOnInit(): void {
    this.points = new Array<{ x: number, y: number }>();
    this.canvas = document.getElementById("tutorial") as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d");

    this.canvas.addEventListener("click", (event: MouseEvent) => this.handleCreateNewPoint(event));
    this.canvas.addEventListener("contextmenu", (event: MouseEvent) => this.handleDeleteLastPoint(event));
    this.canvas.oncontextmenu = () => false ;
  }

  private handleCreateNewPoint(event: MouseEvent): void {
    this.points.push({ x: event.x, y: event.y });
    this.context.beginPath();
    this.context.lineWidth = cst.DEFAULT_LINE_WIDTH;
    this.context.lineJoin = "round";
    this.context.fillStyle = "black";
    this.context.arc(event.x, event.y, cst.DEFAULT_CIRCLE_RADIUS, 0, cst.FULL_CIRCLE_RAD, false);
    this.context.strokeStyle = (this.points.length === 1) ? "red" : "blue";
    this.context.fill();
    this.context.stroke();

    if (this.points.length > 1) {
      this.context.moveTo(event.x, event.y);
      this.context.lineTo(this.points[this.points.length - 2].x, this.points[this.points.length - 2].y);
    }

    this.context.stroke();
    this.context.closePath();
  }

  private handleDeleteLastPoint(event: MouseEvent): void {
    const lastPoint: { x: number, y: number } = this.points.pop();
    this.context.beginPath();
    this.context.lineWidth = cst.DEFAULT_LINE_WIDTH + 2;
    this.context.fillStyle = "white";
    this.context.strokeStyle = "white";
    this.context.arc(lastPoint.x, lastPoint.y, cst.DEFAULT_CIRCLE_RADIUS, 0, cst.FULL_CIRCLE_RAD, false);
    if (this.points.length > 0) {
      this.context.moveTo(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y);
      this.context.lineTo(lastPoint.x, lastPoint.y);
    }
    this.context.fill();
    this.context.stroke();
    this.context.closePath();
  }
}
