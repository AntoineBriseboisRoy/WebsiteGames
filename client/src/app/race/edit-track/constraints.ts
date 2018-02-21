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

    private checkAngleCondition(): void {
        let lastAngleBroken: boolean = false;
        for (let i: number = 0; i < this.segments.length - 1; ++i) {
            if (i > 0 && lastAngleBroken) {
                this.segments[i].broken = true;
            }
            lastAngleBroken = !this.checkAngleBetweenTwoSegments(this.segments[i], this.segments[i + 1]);
            if (lastAngleBroken) {
                this.segments[i].broken = true;
            }
        }
        if (this.segments.length > 0 && lastAngleBroken) {
            this.segments[this.segments.length - 1].broken = true;
        }
        if (this.trackComplete && this.segments.length > 0 &&
                   !this.checkAngleBetweenTwoSegments(this.segments[this.segments.length - 1], this.segments[0])) {
            this.segments[this.segments.length - 1].broken = true;
            this.segments[0].broken = true;
        }
    }

    private checkAngleBetweenTwoSegments(segment1: Segment, segment2: Segment): boolean {
        const vec1: Vector2 = new Vector2(this.points[segment1.secondPoint].x - this.points[segment1.firstPoint].x,
                                          this.points[segment1.secondPoint].y - this.points[segment1.firstPoint].y);
        const vec2: Vector2 = new Vector2(this.points[segment2.firstPoint].x - this.points[segment2.secondPoint].x,
                                          this.points[segment2.firstPoint].y - this.points[segment2.secondPoint].y);

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
            for (let j: number = i + 1; j < this.segments.length; ++j) {
                if (this.intersect(this.segments[i], this.segments[j])) {
                    this.segments[i].broken = true;
                    this.segments[j].broken = true;
                }
            }
        }
    }

    private intersect(segment1: Segment, segment2: Segment): boolean {
        if (Math.max(this.points[segment1.firstPoint].x, this.points[segment1.secondPoint].x) <
        Math.min(this.points[segment2.firstPoint].x, this.points[segment2.secondPoint].x)) {
            return false; // No common X coordinates
        }

        const intersectingXmin: number = Math.max(
            Math.min(this.points[segment1.firstPoint].x, this.points[segment1.secondPoint].x),
            Math.min(this.points[segment2.firstPoint].x, this.points[segment2.secondPoint].x));
        const intersectingXmax: number = Math.min(
            Math.max(this.points[segment1.firstPoint].x, this.points[segment1.secondPoint].x),
            Math.max(this.points[segment2.firstPoint].x, this.points[segment2.secondPoint].x));

        /* f1(x) = a1 * x + b1 */
        let a1: number, a2: number;
        if (this.points[segment1.firstPoint].x === this.points[segment1.secondPoint].x) {
            a1 = 0;
        } else {
            a1 = (this.points[segment1.firstPoint].y - this.points[segment1.secondPoint].y) /
                 (this.points[segment1.firstPoint].x - this.points[segment1.secondPoint].x);
        }
        if (this.points[segment2.firstPoint].x === this.points[segment2.secondPoint].x) {
            a2 = 0;
        } else {
            a2 = (this.points[segment2.firstPoint].y - this.points[segment2.secondPoint].y) /
                 (this.points[segment2.firstPoint].x - this.points[segment2.secondPoint].x);
        }

        const b1: number = this.points[segment1.firstPoint].y - a1 * this.points[segment1.firstPoint].x;
        const b2: number = this.points[segment2.firstPoint].y - a2 * this.points[segment2.firstPoint].x;

        if (a1 === a2) {
            return false; // If they're parallel
        }

        const intersectingX: number = (b2 - b1) / (a1 - a2);

        return !(intersectingX - cst.PRECISION_PIXELS <= intersectingXmin || intersectingX + cst.PRECISION_PIXELS >= intersectingXmax);
    }
}
