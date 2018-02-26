import { Vector2 } from "three";

export interface Position {
  x: number;
  y: number;
}
export interface Point {
  x: number;
  y: number;
  start: boolean;
  end: boolean;
}

export interface PointInSegment extends Point {
  index: number;
}

export interface Interval {
  min: number;
  max: number;
}

export class Segment {

  private firstPoint: PointInSegment;
  private secondPoint: PointInSegment;

  public constructor(firstPoint: number, points: Point[], public broken: boolean) {
    this.firstPoint = this.getPointAtIndex(firstPoint, points);
    this.secondPoint = this.getPointAtIndex(this.getSecondPointIndex(firstPoint, points), points);
  }

  public get FirstPoint(): PointInSegment {
    return this.firstPoint;
  }

  public set FirstPointPosition(position: Position) {
    this.firstPoint.x = position.x;
    this.firstPoint.y = position.y;
  }

  public get SecondPoint(): PointInSegment {
    return this.secondPoint;
  }

  public set SecondPointPosition(position: Position) {
    this.secondPoint.x = position.x;
    this.secondPoint.y = position.y;
  }

  public getAsVector(): Vector2 {
    return new Vector2(this.SecondPoint.x - this.FirstPoint.x,
                       this.SecondPoint.y - this.FirstPoint.y);
  }

  public getLength(): number {
    return this.getAsVector().length();
  }

  public getSlope(): number {
    return (this.FirstPoint.y - this.SecondPoint.y) / (this.FirstPoint.x - this.SecondPoint.x);
  }

  public getB(): number {
    return this.FirstPoint.y - this.getSlope() * this.FirstPoint.x;
  }

  public getYInterval(): Interval {
    return { min: Math.min(this.FirstPoint.y, this.SecondPoint.y),
             max: Math.max(this.FirstPoint.y, this.SecondPoint.y) };
  }

  public isPerfectlyVertical(): boolean {
    return (this.FirstPoint.x === this.SecondPoint.x);
  }

  private getPointAtIndex(index: number, points: Point[]): PointInSegment {
    return { x: points[index].x,
             y: points[index].y,
             start: points[index].start,
             end: points[index].end,
             index: index };
  }

  private getSecondPointIndex(firstPoint: number, points: Point[]): number {
    return points[firstPoint].end ? 0 : firstPoint + 1;
  }
}
