import { Point, Segment, Interval } from "./Geometry";
import { Vector2 } from "three";
import * as cst from "../../constants";
import { InvalidArgumentError } from "../../invalidArgumentError";
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

        for (let i: number = 0; i < this.points.length - 1; ++i) {
            this.segments.push(new Segment(i, this.points, false));
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
        const vec1: Vector2 = new Vector2(segment1.SecondPoint.x - segment1.FirstPoint.x,
                                          segment1.SecondPoint.y - segment1.FirstPoint.y);
        const vec2: Vector2 = new Vector2(segment2.FirstPoint.x - segment2.SecondPoint.x,
                                          segment2.FirstPoint.y - segment2.SecondPoint.y);

        return Math.acos(vec1.dot(vec2) / (vec1.length() * vec2.length())) > cst.PI_OVER_4;
    }

    private checkSegmentLength(): void {
        for (const segment of this.segments) {
            if (new Vector2(segment.SecondPoint.x - segment.FirstPoint.x,
                            segment.SecondPoint.y - segment.FirstPoint.y).length() < cst.TWICE_TRACK_WIDTH) {
                segment.broken = true;
            }
        }
    }

    private checkSegmentOverlap(): void {
        for (let i: number = 0; i < this.segments.length; ++i) {
            for (let j: number = i + 2; j < this.segments.length; ++j) {
                if (!(this.trackComplete && i === 0 && j === this.segments.length - 1)
                    && this.intersect(this.segments[i], this.segments[j])) {
                    this.segments[i].broken = true;
                    this.segments[j].broken = true;
                }
            }
        }
    }

    private intersect(segment1: Segment, segment2: Segment): boolean {
        const longerSegment1: Segment = this.elongateSegment(segment1);
        const longerSegment2: Segment = this.elongateSegment(segment2);

        if (!this.haveCommonXcoordinates(longerSegment1, longerSegment2)) {
            return false; // No common X coordinates
        }

        if (longerSegment1.isPerfectlyVertical()) {
            return this.isWithinInterval(this.getIntersectingY(longerSegment2, longerSegment1), longerSegment1.getYInterval());
        } else if (longerSegment2.isPerfectlyVertical()) {
            return this.isWithinInterval(this.getIntersectingY(longerSegment1, longerSegment2), longerSegment2.getYInterval());
        }

        if (longerSegment1.getSlope() === longerSegment2.getSlope()) {
            return false; // If they're parallel
        }

        return this.isWithinInterval(this.getIntersectingX(longerSegment1, longerSegment2),
                                     this.getInteresectionIntervalX(longerSegment1, longerSegment2));
    }

    private getIntersectingY(segment1: Segment, verticalSegment: Segment): number {
        return segment1.getSlope() * verticalSegment.FirstPoint.x + segment1.getB();
    }

    private isWithinInterval(x: number, interval: Interval): boolean {
        return (x - cst.PRECISION_PIXELS <= interval.max && x + cst.PRECISION_PIXELS >= interval.min);
    }

    private getInteresectionIntervalX(segment1: Segment, segment2: Segment): Interval {
        return { min: Math.max(Math.min(segment1.FirstPoint.x, segment1.SecondPoint.x),
                               Math.min(segment2.FirstPoint.x, segment2.SecondPoint.x)),
                 max: Math.min(Math.max(segment1.FirstPoint.x, segment1.SecondPoint.x),
                               Math.max(segment2.FirstPoint.x, segment2.SecondPoint.x)) };
    }

    private getIntersectingX(segment1: Segment, segment2: Segment): number {
        return (segment2.getB() - segment1.getB()) /
               (segment1.getSlope() - segment2.getSlope());
    }

    private elongateSegment(segment: Segment): Segment {
        const newSegment: Segment = new Segment(segment.FirstPoint.index, this.points, segment.broken);
        newSegment.FirstPointPosition = { x: (this.getXElongated(segment.FirstPoint.x, segment.SecondPoint.x)), y: segment.FirstPoint.y };
        newSegment.SecondPointPosition = { x: (this.getXElongated(segment.SecondPoint.x, segment.FirstPoint.x)), y: segment.SecondPoint.y };

        return newSegment;
    }

    private haveCommonXcoordinates(segment1: Segment, segment2: Segment): boolean {
        return !(Math.max(segment1.FirstPoint.x, segment1.SecondPoint.x) < Math.min(segment2.FirstPoint.x, segment2.SecondPoint.x)
                || Math.max(segment2.FirstPoint.x, segment2.SecondPoint.x) < Math.min(segment1.FirstPoint.x, segment1.SecondPoint.x));
    }

    private getXElongated(currPos: number, otherPos: number): number {
        return currPos + ((Math.max(currPos, otherPos) === currPos) ? cst.DEFAULT_CIRCLE_RADIUS : -cst.DEFAULT_CIRCLE_RADIUS);
    }
}
