export enum CellColor {
    White = "White",
    Black = "Black"
}

export interface ICell {
    index: number;
    hasIndex: boolean;
    content: string;
    cellColor: CellColor;
}
