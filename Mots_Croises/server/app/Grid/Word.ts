import { PosXY } from "./PosXY";

enum Orientation {
    Horizontal = 0,
    Vertical
}

export class Word {

    constructor(private position: PosXY, private length: number,
                private orientation: Orientation, private content: string) { }

    public get Position(): PosXY {
        return this.position;
    }

    public get Length(): number {
        return this.length;
    }

    public get Orientation(): Orientation {
        return this.orientation;
    }

    public get Content(): string {
        return this.content;
    }
}
