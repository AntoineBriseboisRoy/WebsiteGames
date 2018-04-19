import { ICoordXY } from "./ICoordXY";
import { Orientation } from "../constants";

export interface IWord {
    position: ICoordXY;
    orientation: Orientation;
    content: string;
    definition: string;
}
