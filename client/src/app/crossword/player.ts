import { POINT_BY_LETTER } from "../constants";

export class Player {

    public constructor(public name: string, public point: number = 0) {
    }

    public addPoint(nLetter: number): void {
        this.point += (nLetter * POINT_BY_LETTER);
    }
}
