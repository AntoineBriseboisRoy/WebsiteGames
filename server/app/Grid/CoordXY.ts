export class CoordXY {

    public static invertCoordinates(pos: CoordXY): CoordXY {
        return new CoordXY(pos.Y, pos.X);
    }

    constructor(private x: number, private y: number) {
        this.x = Math.abs(Math.floor(x));
        this.y = Math.abs(Math.floor(y));
    }

    public get X(): number {
        return this.x;
    }

    public get Y(): number {
        return this.y;
    }

    public equals(otherPos: CoordXY): boolean {
        return this.x === otherPos.X && this.y === otherPos.Y;
    }

}
