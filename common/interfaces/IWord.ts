import { ICoordXY } from "./ICoordXY";

export enum Orientation {
    Vertical = 0,
    Horizontal
}

export interface IWord {
    position: ICoordXY;
    orientation: Orientation;
    content: string;
    definition: string;
}
