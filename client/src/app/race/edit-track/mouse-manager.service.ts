import { Injectable } from "@angular/core";
import { Point } from "./Geometry";
import { NO_SELECTED_POINT, TWICE_DEFAULT_CIRCLE_RADIUS } from "../../constants";

@Injectable()
export class MouseManagerService {
    public points: Point[];
    public trackComplete: boolean;
    private selectedPoint: number;
    private mousePressed: boolean;
    private moveStartPoint: boolean;
    private clientRect: ClientRect;

    public constructor() {
        this.resetMouseAttributes();
        this.trackComplete = false;
     }

    public init(points: Point[]): void {
        this.trackComplete = (points.length !== 0);
        this.points = points;
    }

    public handleDeleteLastPoint(event: MouseEvent): void {
        this.points.pop();
        this.trackComplete = false;
    }

    public handleLeftMouseDown(event: MouseEvent, clientRect: ClientRect): void {
        this.clientRect = clientRect;
        this.selectedPoint = this.isOnOtherPoint(event.x / this.clientRect.width, event.y / this.clientRect.height);
        this.mousePressed = true;
        if (this.isAnOutsideClick()) {
            this.points.push({ x: event.x / this.clientRect.width, y: event.y / this.clientRect.height,
                               start: (this.points.length === 0), end: this.trackComplete });
            this.selectedPoint = this.points.length - 1;
        }
    }

    public handleMouseUp(event: MouseEvent): void {
        if (this.isClosingTrackClick()) {
            this.trackComplete = true;
            this.points.push({ x: this.points[0].x, y: this.points[0].y, start: false, end: this.trackComplete });
        }
        if (this.isDraggingSelectedPointOnEndPoint(event.x / this.clientRect.width, event.y / this.clientRect.height)) {
            this.trackComplete = true;
            this.points.pop();
            this.points.push({ x: this.points[0].x, y: this.points[0].y, start: false, end: this.trackComplete });
        }
        this.resetMouseAttributes();
    }

    public handleMouseMove(event: MouseEvent): void {
        if (this.isMovingSelectedPoint()) {
            if (this.isMovingStartPoint()) {
                this.points[this.points.length - 1].x = event.x / this.clientRect.width;
                this.points[this.points.length - 1].y = event.y / this.clientRect.height;
            }
            this.points[this.selectedPoint].x = event.x / this.clientRect.width;
            this.points[this.selectedPoint].y = event.y / this.clientRect.height;
            this.moveStartPoint = this.selectedPoint === 0;
        }
    }

    private resetMouseAttributes(): void {
        this.selectedPoint = NO_SELECTED_POINT;
        this.mousePressed = false;
        this.moveStartPoint = false;
    }

    private getDistance(index: number, x: number, y: number): number {
        const xDistance: number = x - this.points[index].x;
        const yDistance: number = y - this.points[index].y;

        // tslint:disable-next-line:no-magic-numbers
        return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    }

    private isOnOtherPoint(x: number, y: number): number {
        for (let i: number = 0; i < this.points.length; ++i) {
            if (this.getDistance(i, x, y) < TWICE_DEFAULT_CIRCLE_RADIUS / this.clientRect.width) {
                return i;
            }
        }

        return NO_SELECTED_POINT;
    }

    private isAnOutsideClick(): boolean {
        return this.selectedPoint === NO_SELECTED_POINT && !this.trackComplete;
    }

    private isClosingTrackClick(): boolean {
        return this.selectedPoint === 0 && !this.moveStartPoint && this.points.length > 1 && !this.trackComplete;
    }

    private isDraggingSelectedPointOnEndPoint(x: number, y: number): boolean {
        return this.points.length > 1 && this.selectedPoint === this.points.length - 1 && this.isOnOtherPoint(x, y) === 0;
    }

    private isMovingSelectedPoint(): boolean {
        return this.mousePressed && this.selectedPoint !== NO_SELECTED_POINT;
    }

    private isMovingStartPoint(): boolean {
        return this.selectedPoint === 0 && this.trackComplete;
    }
}
