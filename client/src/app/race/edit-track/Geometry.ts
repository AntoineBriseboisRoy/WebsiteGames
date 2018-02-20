export interface Point {
  x: number;
  y: number;
  start: boolean;
  end: boolean;
}
export interface Segment {
  firstPoint: number;
  secondPoint: number;
  broken: boolean;
}
