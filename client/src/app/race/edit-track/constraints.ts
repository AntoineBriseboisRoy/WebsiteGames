import { Point, Segment } from "./Geometry";
import { Vector2 } from "three";
import * as cst from "../../constants";

export class Constraints {

    private segments: Segment[];
    private points: Point[];
    private trackComplete: boolean;

    public get Segments(): Segment[] {
        return this.segments;
    }

    public constructor() { }

    public checkConstraints(points: Point[], trackComplete: boolean): void {
        this.points = points;
        this.trackComplete = trackComplete;
        this.instantiateSegmentArray();

        this.checkAngleCondition();
        this.checkSegmentLength();
        this.checkSegmentOverlap();
    }

    private instantiateSegmentArray(): void {
        this.segments = new Array<Segment>();

        for (let i: number = 1; i < this.points.length; ++i) {
            this.segments.push({ firstPoint: i - 1, secondPoint: i, broken: false });
        }
    }

    /* TODO: Refactor */
    private checkAngleCondition(): void {
        let lastAngleBroken: boolean = false;
        for (let i: number = 0; i < this.segments.length - 1; ++i) {
            if (i > 0 && lastAngleBroken) {
                this.segments[i].broken = true;
            }
            lastAngleBroken = !this.checkAngleBetweenTwoSegments(this.points[this.segments[i].firstPoint],
                                                                 this.points[this.segments[i].secondPoint],
                                                                 this.points[this.segments[i + 1].secondPoint]);
            if (lastAngleBroken) {
                this.segments[i].broken = true;
            }
        }
        if (this.segments.length > 0 && lastAngleBroken) {
            this.segments[this.segments.length - 1].broken = true;
        }
        if (this.trackComplete && this.segments.length > 0 &&
                   !this.checkAngleBetweenTwoSegments(this.points[this.segments[this.segments.length - 1].firstPoint],
                                                      this.points[this.segments[this.segments.length - 1].secondPoint],
                                                      this.points[this.segments[0].secondPoint])) {
            this.segments[this.segments.length - 1].broken = true;
            this.segments[0].broken = true;
        }
    }

    private checkAngleBetweenTwoSegments(point1: Point, point2: Point, point3: Point): boolean {
        const vec1: Vector2 = new Vector2(point3.x - point2.x, point3.y - point2.y);
        const vec2: Vector2 = new Vector2(point1.x - point2.x, point1.y - point2.y);

        return Math.acos(vec1.dot(vec2) / (vec1.length() * vec2.length())) > cst.PI_OVER_4;
    }

    private checkSegmentLength(): void {
        for (const segment of this.segments) {
            if (new Vector2(this.points[segment.secondPoint].x - this.points[segment.firstPoint].x,
                            this.points[segment.secondPoint].y - this.points[segment.firstPoint].y).length() <
                cst.TWICE_TRACK_WIDTH) {
                segment.broken = true;
            }
        }
    }

    private checkSegmentOverlap(): void {
        for (let i: number = 0; i < this.segments.length; ++i) {
            for (let j: number = i; j < this.segments.length; ++j) {
                if (this.intersect(this.points[this.segments[i].firstPoint], this.points[this.segments[i].secondPoint],
                                   this.points[this.segments[j].firstPoint], this.points[this.segments[j].secondPoint])) {
                    this.segments[i].broken = true;
                    this.segments[j].broken = true;
                }
            }
        }
    }

    private intersect(point1: Point, point2: Point, point3: Point, point4: Point): boolean {
        return this.counterClockwise(point1, point3, point4) !== this.counterClockwise(point2, point3, point4)
            && this.counterClockwise(point1, point2, point3) !== this.counterClockwise(point1, point2, point4);
    }

    private counterClockwise(point1: Point, point2: Point, point3: Point): boolean {
        return (point3.y - point1.y) * (point2.x - point1.x) > (point2.y - point1.y) * (point3.x - point1.x);
    }
}
