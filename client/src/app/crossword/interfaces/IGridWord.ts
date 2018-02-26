import { ICell } from "./ICell";
import {Orientation} from "../../constants";

export interface IGridWord {
    cells: Array<ICell>;
    correctAnswer: string;
    definition: string;
    orientation: Orientation;
    isFound: boolean;
}
