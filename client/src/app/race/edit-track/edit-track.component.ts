import { Component, OnInit, HostListener } from "@angular/core";
import { Point, Segment } from "./Geometry";
import { TRACK_WIDTH, DEFAULT_LINE_WIDTH, FULL_CIRCLE_RAD,
         DEFAULT_CIRCLE_RADIUS, RIGHT_MOUSE_BUTTON } from "../../constants";
import { Constraints } from "./constraints";
import { MouseManagerService } from "./mouse-manager.service";

@Component({
    selector: "app-edit-track",
    templateUrl: "./edit-track.component.html",
    styleUrls: ["./edit-track.component.css"],
    providers: [ MouseManagerService ]
})
export class EditTrackComponent implements OnInit {
    private constraints: Constraints;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private points: Point[];

    public constructor(public mouseManagerService: MouseManagerService) {
        this.constraints = new Constraints();
        this.points = new Array<Point>();
     }

    public ngOnInit(): void {
        this.canvas = document.getElementById("edit") as HTMLCanvasElement;
        this.context = this.canvas.getContext("2d");
        this.mouseManagerService.init(this.points);
        this.canvas.oncontextmenu = () => false;
        this.resizeWindow();

        this.canvas.addEventListener("mousedown", (event: MouseEvent) => {
            if (event.button === RIGHT_MOUSE_BUTTON) {
                this.mouseManagerService.handleDeleteLastPoint(event);
            } else {
                this.mouseManagerService.handleLeftMouseDown(event);
            }
            this.redrawCanvas();
        });

        this.canvas.addEventListener("mouseup", (event: MouseEvent) => {
             this.mouseManagerService.handleMouseUp(event);
             this.redrawCanvas();
        });

        this.canvas.addEventListener("mousemove", (event: MouseEvent) => {
            this.mouseManagerService.handleMouseMove(event);
            this.redrawCanvas();
        });
    }

    @HostListener("window:resize", ["$event"])
    private resizeWindow(): void {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.drawRoads();
        this.drawPoints();
    }

    public get Points(): Point[] {
        return this.points;
    }

    public get canBeSaved(): boolean {
        return this.mouseManagerService.trackComplete && !this.constraints.isBroken && this.areFieldsComplete;
    }

    private getInputElement(id: string): HTMLInputElement {
        return document.getElementById(id) as HTMLInputElement;
    }

    private get areFieldsComplete(): boolean {
        return this.getInputElement("Description").value !== this.getInputElement("Description").defaultValue &&
               this.getInputElement("Name").value !== this.getInputElement("Name").defaultValue;
    }

    public getPopoverContent(): string {
        let content: string = "";
        if (!this.mouseManagerService.trackComplete) {
            content += "The current track is incomplete.";
        } else if (this.constraints.isBroken) {
            content += "Some constraints have been broken.";
        } else if (!this.areFieldsComplete) {
            content += "Please write a track name and description.";
        }

        return content;
    }

    private redrawCanvas(): void {
        this.context.clearRect(0, 0, this.canvas.getBoundingClientRect().width, this.canvas.getBoundingClientRect().width);
        this.drawRoads();
        this.drawPoints();
    }

    private drawRoads(): void {
        this.constraints.checkConstraints(this.points, this.mouseManagerService.trackComplete);
        const segments: Segment[] = this.constraints.Segments;
        this.context.lineWidth = TRACK_WIDTH;
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
            this.context.lineWidth = DEFAULT_LINE_WIDTH;
            this.context.lineJoin = "round";
            this.context.fillStyle = "black";
            this.context.arc(iterator.x, iterator.y, DEFAULT_CIRCLE_RADIUS, 0, FULL_CIRCLE_RAD, false);
            this.context.strokeStyle = (iterator.start || iterator.end) ? "green" : "blue";
            this.context.stroke();
            this.context.fill();
            this.context.closePath();
        }
    }
}
