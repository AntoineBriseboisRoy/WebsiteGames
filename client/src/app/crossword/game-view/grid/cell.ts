import { OnInit } from "@angular/core";

export class Cell implements OnInit {
    public constructor(private index: number, private hasIndex: boolean, private content: string, private isBlack: boolean) {
    }

    public ngOnInit(): void {
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
