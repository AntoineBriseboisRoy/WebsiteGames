import { CoordXY } from "./CoordXY";

export enum Orientation {
    Horizontal = 0,
    Vertical
}

export class Word {

    private length: number;

    constructor(private position: CoordXY, private orientation: Orientation, private content: string, private definition: string) {
        this.length = content.length;
    }

    public get Position(): CoordXY {
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
