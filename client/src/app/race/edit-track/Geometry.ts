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

  public constructor(firstPoint: number, private points: Point[], public broken: boolean) {
    this.firstPoint = this.getPointAtIndex(firstPoint);
    this.secondPoint = this.getPointAtIndex(this.getSecondPointIndex(firstPoint));
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

  private getPointAtIndex(index: number): PointInSegment {
    return { x: this.points[index].x, y: this.points[index].y, start: this.isStartPoint(index),
             end: this.isEndPoint(index), index: index };
  }

  private isStartPoint(index: number): boolean {
    return (index === 0);
  }

  private isEndPoint(index: number): boolean {
    return (index === this.points.length - 1);
  }

  private getSecondPointIndex(firstPoint: number): number {
    return (firstPoint === this.points.length - 1) ? 0 : firstPoint + 1;
  }
}
