
export enum CellColor {
    White = "White",
    Black = "Black"
}

export enum Finder {
    player1 = 0,
    player2 = 1,
    nobody = -1,
    both = 2
}

export interface ICell {
    gridIndex: number;
    index: number;
    answer: string;
    cellColor: CellColor;
    content: string;
    isFound: boolean;
    finder: Finder;
}