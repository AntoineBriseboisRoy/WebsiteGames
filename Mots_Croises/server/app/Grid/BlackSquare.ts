import { PosXY } from "./PosXY";

export class BlackSquare {
    constructor(private position: PosXY) {}

    public get Position(): PosXY {
        return this.position;
    }
}
