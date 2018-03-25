const POINT_BY_LETTER: number = 10;

export class Player {

    public constructor(public username: string, public socketID: string, public score: number = 0) {
    }

    public addPoints(nLetter: number): void {
        this.score += (nLetter * POINT_BY_LETTER);
    }
}
