import { Injectable } from "@angular/core";
import { Point } from "./Geometry";
import * as cst from "../../constants";

@Injectable()
export class MouseManagerService {
    public points: Point[];
    public trackComplete: boolean;
    private selectedPoint: number;
    private mousePressed: boolean;
    private moveStartPoint: boolean;

    public constructor() {
        this.resetMouseAttributes();
        this.trackComplete = false;
     }

    public init(points: Point[]): void {
        this.points = points;
    }

    public handleDeleteLastPoint(event: MouseEvent): void {
        this.points.pop();
        this.trackComplete = false;
    }

    public handleLeftMouseDown(event: MouseEvent): void {
        this.selectedPoint = this.isOnOtherPoint(event.x, event.y);
        this.mousePressed = true;
        if (this.isAnOutsideClick()) {
            this.points.push({ x: event.x, y: event.y, start: (this.points.length === 0), end: this.trackComplete });
            this.selectedPoint = this.points.length - 1;
        }
    }

    public handleMouseUp(event: MouseEvent): void {
        if (this.isClosingTrackClick()) {
            this.trackComplete = true;
            this.points.push({ x: this.points[0].x, y: this.points[0].y, start: false, end: this.trackComplete });
        }
        if (this.isDraggingSelectedPointOnEndPoint(event)) {
            this.trackComplete = true;
            this.points.pop();
            this.points.push({ x: this.points[0].x, y: this.points[0].y, start: false, end: this.trackComplete });
        }
        this.resetMouseAttributes();
    }

    public handleMouseMove(event: MouseEvent): void {
        if (this.isMovingSelectedPoint()) {
            if (this.isMovingStartPoint()) {
                this.points[this.points.length - 1].x = event.x;
                this.points[this.points.length - 1].y = event.y;
            }
            this.points[this.selectedPoint].x = event.x;
            this.points[this.selectedPoint].y = event.y;
            this.moveStartPoint = this.selectedPoint === 0;
        }
    }

    private resetMouseAttributes(): void {
        this.selectedPoint = cst.NO_SELECTED_POINT;
        this.mousePressed = false;
        this.moveStartPoint = false;
    }

    private isOnOtherPoint(x: number, y: number): number {
        for (let i: number = 0; i < this.points.length; ++i) {
            if (this.points[i].x + cst.TWICE_DEFAULT_CIRCLE_RADIUS > x &&
                this.points[i].x - cst.TWICE_DEFAULT_CIRCLE_RADIUS < x &&
                this.points[i].y + cst.TWICE_DEFAULT_CIRCLE_RADIUS > y &&
                this.points[i].y - cst.TWICE_DEFAULT_CIRCLE_RADIUS < y) {
                return i;
            }
        }

        return cst.NO_SELECTED_POINT;
    }

    private isAnOutsideClick(): boolean {
        return this.selectedPoint === cst.NO_SELECTED_POINT && !this.trackComplete;
    }

    private isClosingTrackClick(): boolean {
        return this.selectedPoint === 0 && !this.moveStartPoint && this.points.length > 1 && !this.trackComplete;
    }

    private isDraggingSelectedPointOnEndPoint(event: MouseEvent): boolean {
        return this.points.length > 1 && this.selectedPoint === this.points.length - 1 && this.isOnOtherPoint(event.x, event.y) === 0;
    }

    private isMovingSelectedPoint(): boolean {
        return this.mousePressed && this.selectedPoint !== cst.NO_SELECTED_POINT;
    }

    private isMovingStartPoint(): boolean {
        return this.selectedPoint === 0 && this.trackComplete;
    }
}
