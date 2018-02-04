import { CoordXY } from "./CoordXY";

export class BlackSquare {
    constructor(private position: CoordXY) {}

    public get Position(): CoordXY {
        return this.position;
    }
}
