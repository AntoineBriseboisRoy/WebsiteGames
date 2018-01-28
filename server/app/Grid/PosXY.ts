export class PosXY {

    public static invertCoordinates(pos: PosXY): PosXY {
        return new PosXY(pos.Y, pos.X);
    }

    constructor(private x: number, private y: number) {
        this.x = Math.abs(Math.floor(x));
        this.y = Math.abs(Math.floor(y));
    }

    public get X(): number {
        return this.x;
    }

    public set X(x: number) {
        this.x = Math.abs(Math.floor(x));
    }

    public get Y(): number {
        return this.y;
    }

    public set Y(y: number) {
        this.y = Math.abs(Math.floor(y));
    }

    public equals(otherPos: PosXY): boolean {
        return this.x === otherPos.X && this.y === otherPos.Y;
    }

}
