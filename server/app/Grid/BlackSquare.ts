import { CoordXY } from "./CoordXY";

export class BlackSquare {
    public constructor(private position: CoordXY) {}

    public get Position(): CoordXY {
        return this.position;
    }
}
