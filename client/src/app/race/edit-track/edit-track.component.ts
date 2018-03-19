import { Component, OnInit, HostListener, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Point, Segment } from "./Geometry";
import { TRACK_WIDTH, DEFAULT_LINE_WIDTH, FULL_CIRCLE_RAD,
         DEFAULT_CIRCLE_RADIUS, RIGHT_MOUSE_BUTTON } from "../../constants";
import { Constraints } from "./constraints";
import { MouseManagerService } from "./mouse-manager.service";
import { ITrack, TrackType } from "../../../../../common/interfaces/ITrack";
import { MongoQueryService } from "../../mongo-query.service";
import { Params } from "@angular/router/src/shared";

@Component({
    selector: "app-edit-track",
    templateUrl: "./edit-track.component.html",
    styleUrls: ["./edit-track.component.css"],
    providers: [ MouseManagerService, MongoQueryService ]
})
export class EditTrackComponent implements OnInit {
    private constraints: Constraints;
    @ViewChild("mycanvas")
    private canvas: ElementRef;
    private context: CanvasRenderingContext2D;
    private track: ITrack;

    private get Canvas(): HTMLCanvasElement {
        return this.canvas.nativeElement as HTMLCanvasElement;
    }

    public constructor(public mouseManagerService: MouseManagerService, private mongoQueryService: MongoQueryService,
                       private route: ActivatedRoute) {
        this.constraints = new Constraints();
        this.track = { _id: "",
                       name: "",
                       description: "",
                       nTimesPlayed: 0,
                       bestTimes: new Array<string>(),
                       type: TrackType.REGULAR,
                       points: new Array<Point>()} as ITrack;
     }

    public ngOnInit(): void {
        this.context = this.Canvas.getContext("2d");
        this.Canvas.oncontextmenu = () => false;
        this.resizeWindow();
        this.route.queryParams.subscribe((params: Params) => {
            if (params["name"] !== undefined) {
                this.mongoQueryService.getTrack(params["name"]).then((track: ITrack) => {
                    this.track = track;
                    this.initializeMouseEvents();
                });
            } else {
                this.initializeMouseEvents();
            }
        });
    }

    @HostListener("window:resize", ["$event"])
    private resizeWindow(): void {
        this.Canvas.width = window.innerWidth;
        this.Canvas.height = window.innerHeight;
        this.drawRoads();
        this.drawPoints();
    }

    public get Points(): Point[] {
        return this.track.points;
    }

    public get canBeSaved(): boolean {
        return this.mouseManagerService.trackComplete && !this.constraints.isBroken && this.areFieldsComplete;
    }

    private initializeMouseEvents(): void {
        console.log(this.track);
        this.mouseManagerService.init(this.track.points);
        this.Canvas.addEventListener("mousedown", (event: MouseEvent) => {
            if (event.button === RIGHT_MOUSE_BUTTON) {
                this.mouseManagerService.handleDeleteLastPoint(event);
            } else {
                this.mouseManagerService.handleLeftMouseDown(event, this.Canvas.getBoundingClientRect());
            }
            this.redrawCanvas();
        });

        this.Canvas.addEventListener("mouseup", (event: MouseEvent) => {
             this.mouseManagerService.handleMouseUp(event);
             this.redrawCanvas();
        });

        this.Canvas.addEventListener("mousemove", (event: MouseEvent) => {
            this.mouseManagerService.handleMouseMove(event);
            this.redrawCanvas();
        });
    }

    private get areFieldsComplete(): boolean {
        return this.track.name !== "" && this.track.description !== "";
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
        this.context.clearRect(0, 0, this.Canvas.getBoundingClientRect().width, this.Canvas.getBoundingClientRect().width);
        this.drawRoads();
        this.drawPoints();
    }

    private drawRoads(): void {
        this.constraints.checkConstraints(this.track.points, this.mouseManagerService.trackComplete, this.Canvas.getBoundingClientRect());
        const segments: Segment[] = this.constraints.Segments;
        this.context.lineWidth = TRACK_WIDTH;
        this.context.beginPath();

        for (let i: number = 0; i < segments.length; ++i) {
            this.context.beginPath();
            this.context.moveTo(segments[i].FirstPoint.x * this.Canvas.getBoundingClientRect().width,
                                segments[i].FirstPoint.y * this.Canvas.getBoundingClientRect().height);
            this.context.lineTo(segments[i].SecondPoint.x * this.Canvas.getBoundingClientRect().width,
                                segments[i].SecondPoint.y * this.Canvas.getBoundingClientRect().height);
            this.context.strokeStyle = segments[i].broken ? "red" : (i === 0) ? "green" : "black";
            this.context.stroke();
            this.context.closePath();
        }
    }

    private drawPoints(): void {
        for (const iterator of this.track.points) {
            this.context.beginPath();
            this.context.lineWidth = DEFAULT_LINE_WIDTH;
            this.context.lineJoin = "round";
            this.context.fillStyle = "black";
            this.context.arc(iterator.x * this.Canvas.getBoundingClientRect().width,
                             iterator.y * this.Canvas.getBoundingClientRect().height,
                             DEFAULT_CIRCLE_RADIUS, 0, FULL_CIRCLE_RAD, false);
            this.context.strokeStyle = (iterator.start || iterator.end) ? "green" : "blue";
            this.context.stroke();
            this.context.fill();
            this.context.closePath();
        }
    }

    private saveTrack(): void {
        this.mongoQueryService.putTrack(this.track.name, this.track);
    }
}
