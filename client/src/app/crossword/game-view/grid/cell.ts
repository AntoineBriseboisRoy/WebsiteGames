export class Cell {
    public constructor(private index: number, private hasIndex: boolean, private content: string, private isBlack: boolean) {
    }

    public getIndex(): number {
        return this.index;
    }

    public hasAnIndex(): boolean {
        return this.hasIndex;
    }

    public getContent(): string {
        return this.content;
    }

    public isBlackSquare(): boolean {
        return this.isBlack;
    }
}
