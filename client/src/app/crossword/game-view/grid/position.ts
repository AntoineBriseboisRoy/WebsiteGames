export class Position {
    public constructor(private x: number, private y: number) {
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public update(lenght: number, width: number) {
        this.x += lenght;
        if (this.x >= width) {
            this.x %= width;
            this.y++;
        }
    }
}
