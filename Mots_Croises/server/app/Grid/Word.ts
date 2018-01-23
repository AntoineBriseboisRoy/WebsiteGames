import { PosXY } from "./PosXY";

export enum Orientation {
    Horizontal = 0,
    Vertical
}

export class Word {

    private length: number;

    constructor(private position: PosXY, private orientation: Orientation,
                private content: string, private orderOfInsertion: number) {
        this.length = content.length;
    }

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
