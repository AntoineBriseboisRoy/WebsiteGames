export class CoordXY {

    public static invertCoordinates(coord: CoordXY): CoordXY {
        return new CoordXY(coord.Y, coord.X);
    }

    public constructor(private x: number, private y: number) {
        this.x = Math.abs(Math.floor(x));
        this.y = Math.abs(Math.floor(y));
    }

    public get X(): number {
        return this.x;
    }

    public get Y(): number {
        return this.y;
    }

    public equals(otherCoord: CoordXY): boolean {
        return this.x === otherCoord.X && this.y === otherCoord.Y;
    }
}
