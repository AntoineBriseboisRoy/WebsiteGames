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
        this.instantiateSegmentArray();

        this.checkAngleCondition();
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
        } else if (this.trackComplete && this.segments.length > 0 &&
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
}
