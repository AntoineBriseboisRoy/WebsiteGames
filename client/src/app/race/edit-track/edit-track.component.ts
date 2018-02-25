import { Component, OnInit } from "@angular/core";
import { Point, Segment } from "./Geometry";
import * as cst from "../../constants";
import { Constraints } from "./constraints";

@Component({
  selector: "app-edit-track",
  templateUrl: "./edit-track.component.html",
  styleUrls: ["./edit-track.component.css"]
})
export class EditTrackComponent implements OnInit {
  private constraints: Constraints = new Constraints();
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private points: Point[];
  private mousePressed: boolean = false;
  private trackComplete: boolean = false;
  private selectedPoint: number;
  public constructor() { }

  public ngOnInit(): void {
    this.points = new Array<Point>();
    this.canvas = document.getElementById("edit") as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d");
    this.resizeWindow();

    window.addEventListener("resize", () => this.resizeWindow());
    this.canvas.oncontextmenu = () => false ;

    this.canvas.addEventListener("mousedown", (event: MouseEvent) => {
      if (event.button === cst.RIGHT_MOUSE_BUTTON) {
        this.handleDeleteLastPoint(event);
      } else {
        this.handleLeftMouseDown(event);
      }
    });

    this.canvas.addEventListener("mouseup", () => {
      this.mousePressed = false;
      this.selectedPoint = cst.NO_SELECTED_POINT;
    });

    this.canvas.addEventListener("mousemove", (event: MouseEvent) => this.handleMouseMove(event));
  }

  public get Points(): Point[] {
    return this.points;
  }

  private getInputElement(id: string): HTMLInputElement {
    return document.getElementById(id) as HTMLInputElement;
  }

  private get areFieldsComplete(): boolean {
    return this.getInputElement("Description").value !== this.getInputElement("Description").defaultValue &&
           this.getInputElement("Name").value !== this.getInputElement("Name").defaultValue;
  }

  public get canBeSaved(): boolean {
    return this.trackComplete && !this.constraints.isBroken && this.areFieldsComplete;
  }

  private resizeWindow(): void {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.drawRoads();
      this.drawPoints();
  }

  private handleDeleteLastPoint(event: MouseEvent): void {
    this.points.pop();
    this.trackComplete = false;
    this.redrawCanvas();
  }

  private handleMouseMove(event: MouseEvent): void {
    if (this.mousePressed) {
      if (this.selectedPoint !== cst.NO_SELECTED_POINT) {
        this.points[this.selectedPoint].x = event.x;
        this.points[this.selectedPoint].y = event.y;
      }
      this.redrawCanvas();
    }
  }

  private handleLeftMouseDown(event: MouseEvent): void {
    this.selectedPoint = this.isOnOtherPoint(event.x, event.y);
    this.mousePressed = (this.selectedPoint !== 0);
    if (this.selectedPoint === cst.NO_SELECTED_POINT && !this.trackComplete) {
      this.points.push({ x: event.x, y: event.y, start: (this.points.length === 0), end: this.trackComplete });
      this.selectedPoint = this.points.length - 1;
    } else if (this.selectedPoint === 0 && !this.trackComplete) {
      this.mousePressed = false;
      this.trackComplete = true;
      this.points.push({ x: this.points[0].x, y: this.points[0].y, start: false, end: this.trackComplete });
    }
    this.redrawCanvas();
  }

  private redrawCanvas(): void {
    this.context.clearRect(0, 0, this.canvas.getBoundingClientRect().width, this.canvas.getBoundingClientRect().width);
    this.drawRoads();
    this.drawPoints();
  }

  private drawRoads(): void {
    this.constraints.checkConstraints(this.points, this.trackComplete);
    const segments: Segment[] = this.constraints.Segments;
    this.context.lineWidth = cst.TRACK_WIDTH;
    this.context.beginPath();

    for (let i: number = 0; i < segments.length; ++i) {
      this.context.beginPath();
      this.context.moveTo(segments[i].FirstPoint.x, segments[i].FirstPoint.y);
      this.context.lineTo(segments[i].SecondPoint.x, segments[i].SecondPoint.y);
      this.context.strokeStyle = segments[i].broken ? "red" : (i === 0) ? "green" : "black";
      this.context.stroke();
      this.context.closePath();
    }
  }

  private drawPoints(): void {
    for (const iterator of this.points) {
      this.context.beginPath();
      this.context.lineWidth = cst.DEFAULT_LINE_WIDTH;
      this.context.lineJoin = "round";
      this.context.fillStyle = "black";
      this.context.arc(iterator.x, iterator.y, cst.DEFAULT_CIRCLE_RADIUS, 0, cst.FULL_CIRCLE_RAD, false);
      this.context.strokeStyle = (iterator.start || iterator.end) ? "green" : "blue";
      this.context.stroke();
      this.context.fill();
      this.context.closePath();
    }
  }

  private isOnOtherPoint(x: number, y: number): number {
    for (let i: number = 0; i < this.points.length; ++i) {
      if (this.points[i].x + cst.TWICE_DEFAULT_CIRCLE_RADIUS > x &&
          this.points[i].x - cst.TWICE_DEFAULT_CIRCLE_RADIUS < x &&
          this.points[i].y + cst.TWICE_DEFAULT_CIRCLE_RADIUS > y &&
          this.points[i].y - cst.TWICE_DEFAULT_CIRCLE_RADIUS < y ) {
            return i;
      }
    }

    return cst.NO_SELECTED_POINT;
  }
}
