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

    public get isBroken(): boolean {
        for (const segment of this.segments) {
            if (segment.broken) {
                return true;
            }
        }

        return false;
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
            for (let j: number = i + 2; j < this.segments.length; ++j) {
                if (this.intersect(this.segments[i], this.segments[j])) {
                    this.segments[i].broken = true;
                    this.segments[j].broken = true;
                }
            }
        }
    }

    private intersect(segment1: Segment, segment2: Segment): boolean {
        const x1: number = this.initializePoint(this.points[segment1.firstPoint].x, this.points[segment1.secondPoint].x);
        const x2: number = this.initializePoint(this.points[segment1.secondPoint].x, this.points[segment1.firstPoint].x);
        const x3: number = this.initializePoint(this.points[segment2.firstPoint].x, this.points[segment2.secondPoint].x);
        const x4: number = this.initializePoint(this.points[segment2.secondPoint].x, this.points[segment2.firstPoint].x);
        const y1: number = this.initializePoint(this.points[segment1.firstPoint].y, this.points[segment1.secondPoint].y);
        const y2: number = this.initializePoint(this.points[segment1.secondPoint].y, this.points[segment1.firstPoint].y);
        const y3: number = this.initializePoint(this.points[segment2.firstPoint].y, this.points[segment2.secondPoint].y);
        const y4: number = this.initializePoint(this.points[segment2.secondPoint].y, this.points[segment2.firstPoint].y);

        if (Math.max(x1, x2) < Math.min(x3, x4) || Math.max(x3, x4) < Math.min(x1, x2)) {
            return false; // No common X coordinates
        }

        const intersectingXmin: number = Math.max(Math.min(x1, x2), Math.min(x3, x4));
        const intersectingXmax: number = Math.min(Math.max(x1, x2), Math.max(x3, x4));
        let b1: number, b2: number;
        /* f1(x) = a1 * x + b1 */
        let a1: number, a2: number;
        if (x1 === x2) {
            a2 = (y3 - y4) / (x3 - x4);
            b2 = y3 - a2 * x3;
            const intersectingY: number = a2 * x1 + b2;

            return (intersectingY <= Math.max(y1, y2) && intersectingY >= Math.min(y1, y2));
        } else if (x3 === x4) {
            a1 = (y1 - y2) / (x1 - x2);
            b1 = y1 - a1 * x1;
            const intersectingY: number = a1 * x3 + b1;

            return (intersectingY <= Math.max(y3, y4) && intersectingY >= Math.min(y3, y4));
        }
        a1 = (y1 - y2) / (x1 - x2);
        a2 = (y3 - y4) / (x3 - x4);
        b1 = y1 - a1 * x1;
        b2 = y3 - a2 * x3;

        if (a1 === a2) {
            return false; // If they're parallel
        }

        const intersectingX: number = (b2 - b1) / (a1 - a2);

        return !(intersectingX - cst.PRECISION_PIXELS <= intersectingXmin || intersectingX + cst.PRECISION_PIXELS >= intersectingXmax);
    }

    private initializePoint(currPos: number, otherPos: number): number {
        return currPos + ((Math.max(currPos, otherPos) === currPos) ? cst.DEFAULT_CIRCLE_RADIUS : -cst.DEFAULT_CIRCLE_RADIUS);
    }
}
