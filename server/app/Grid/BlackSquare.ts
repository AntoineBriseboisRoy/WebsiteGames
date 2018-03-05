import { ICoordXY } from "../../../common/interfaces/ICoordXY";

export class BlackSquare {
    public constructor(private position: ICoordXY) {}

    public get Position(): ICoordXY {
        return this.position;
    }
}
