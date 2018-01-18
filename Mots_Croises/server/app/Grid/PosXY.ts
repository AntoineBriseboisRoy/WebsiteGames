class PosXY {

    constructor(private x: number, private y: number) { }

    public get X(): number {
        return this.x;
    }

    public set X(x: number) {
        this.x = Math.floor(x);
    }

    public get Y(): number {
        return this.x;
    }

    public set Y(y: number) {
        this.y = Math.floor(y);
    }

    public equals(otherPos: PosXY): boolean {
        return this.x === otherPos.X && this.y === otherPos.Y;
    }

}
