export interface Point {
  x: number;
  y: number;
  start: boolean;
  end: boolean;
}
export interface PointInSegment extends Point {
  index: number;
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
  public get SecondPoint(): PointInSegment {
    return this.secondPoint;
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
