export class Player {

    public constructor(public username: string, public socketID: string, public score: number = 0) {
    }

    public addPoints(): void {
        this.score += 1;
    }

    public clear(): void {
        this.username = "";
        this.score = 0;
    }
}
