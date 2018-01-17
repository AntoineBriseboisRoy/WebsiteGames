class PosXY {

    constructor(private x : number, private y : number) { 
        this.setX(x);
        this.setY(y);
    }

    public getX() : number {
        return this.x;
    }

    public setX(x: number) : void {
        this.x = Math.floor(x);
    }

    public getY() : number {
        return this.x;
    }

    public setY(y: number) : void {
        this.y = Math.floor(y);
    }

    public equals(otherPos : PosXY) {
        return this.x === otherPos.getX() && this.y === otherPos.getY();
    }
}