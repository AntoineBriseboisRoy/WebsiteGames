import { Component, OnInit } from "@angular/core";
import { Point } from "./Point";
import * as cst from "../../constants";
import { IterableChangeRecord_ } from "@angular/core/src/change_detection/differs/default_iterable_differ";

@Component({
  selector: "app-edit-track",
  templateUrl: "./edit-track.component.html",
  styleUrls: ["./edit-track.component.css"]
})
export class EditTrackComponent implements OnInit {

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private points: Point[];
  private img: HTMLImageElement;
  private mousePressed: boolean = false;
  private animationID: number;
  private selectedPoint: number;
  public constructor() { }

  // tslint:disable-next-line:max-func-body-length
  public ngOnInit(): void {
    this.points = new Array<Point>();
    this.canvas = document.getElementById("edit") as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d");
    this.resizeWindow();

    window.addEventListener("resize", () => this.resizeWindow());
    this.canvas.oncontextmenu = () => false ;
    this.canvas.addEventListener("mousedown", (event: MouseEvent) => {
      if (event.button !== 2) {
        this.mousePressed = true;
        this.selectedPoint = this.isOnOtherPoint(event.x, event.y);
        if (this.selectedPoint === -1) {
          this.points.push(new Point(event.x, event.y,  (this.points.length === 0), false));
          this.selectedPoint = this.points.length - 1;
        } else if (this.selectedPoint === 0) {
          this.mousePressed = false;
          this.points.push(new Point(this.points[0].x, this.points[0].y, false, true));
        }
        this.redrawCanvas();
      } else {
        this.handleDeleteLastPoint(event);
      }
    });

    this.canvas.addEventListener("mouseup", () => {
      this.mousePressed = false;
      window.cancelAnimationFrame(this.animationID);
      this.selectedPoint = -1;
    });

    this.canvas.addEventListener("mousemove", (event: MouseEvent) => {
      if (this.mousePressed) {
        if (this.selectedPoint !== -1) {
          this.points[this.selectedPoint].x = event.x;
          this.points[this.selectedPoint].y = event.y;
        }
        this.redrawCanvas();
      }
    });
  }

  private resizeWindow(): void {
      this.canvas.width = window.innerWidth - 10;
      this.canvas.height = window.innerHeight - 10;
      this.drawRoads();
      this.drawPoints();
  }

  /*private drawimage(): void {
    this.img = new Image();
    this.img.onload = () => {
      this.context.drawImage(this.img, 0, 0);
      this.context.stroke();
    };
    this.img.src = "https://www.sketchuptextureclub.com/public/texture_m/0013-road-texture-seamless.jpg";
  }*/
  
  private handleDeleteLastPoint(event: MouseEvent): void {
    this.points.pop();
    this.redrawCanvas();
  }

  private redrawCanvas(): void {
    this.context.clearRect(0, 0, this.canvas.getBoundingClientRect().width, this.canvas.getBoundingClientRect().width);
    this.drawRoads();
    this.drawPoints();
  }

  private drawRoads(): void {
    this.context.lineWidth = cst.DEFAULT_LINE_WIDTH;
    this.context.beginPath();
    this.context.strokeStyle = "red";
    for (let i: number = 1; i < this.points.length; ++i) {
      this.context.beginPath();
      this.context.moveTo(this.points[i - 1].x, this.points[i - 1].y);
      this.context.lineTo(this.points[i].x, this.points[i].y);
      this.context.stroke();
      this.context.strokeStyle = "black";
      this.context.closePath();
    }
  }

  private drawPoints(): void {
    for (const iterator of this.points) {
      this.context.beginPath();
      this.context.lineWidth = cst.DEFAULT_LINE_WIDTH;
      this.context.lineJoin = "round";
      this.context.fillStyle = "black";
      console.log(iterator.x, iterator.y);
      this.context.arc(iterator.x, iterator.y, cst.DEFAULT_CIRCLE_RADIUS, 0, cst.FULL_CIRCLE_RAD, false);
      this.context.strokeStyle = (iterator.start) ? "red" : "blue";
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

    return -1;
  }

}
