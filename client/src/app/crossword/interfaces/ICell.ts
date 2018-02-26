import { Orientation } from "../../../../../common/interfaces/IWord";

export enum CellColor {
    White = "White",
    Black = "Black"
}

export interface ICell {
    gridIndex: number;
    index: number;
    answer: string;
    cellColor: CellColor;
    content: string;
    isFound: boolean;
}
