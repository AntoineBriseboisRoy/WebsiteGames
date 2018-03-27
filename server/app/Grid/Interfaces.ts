import { ICoordXY } from "../../../common/interfaces/ICoordXY";

export interface DictionaryEntry {
    word: string;
    definition: string;
    field3: string;
}

export interface Constraint {
    letter: string;
    position: number;
}
export interface BlackSquare {
    position: ICoordXY;
}
