import { ICoordXY } from "../server/app/Grid/CoordXY";

export enum Orientation {
    Vertical = 0,
    Horizontal
}

export interface IWord {
    position: ICoordXY;
    orientation: Orientation;
    content: string;
    definition: string;
}

/*
export class Word {

    private length: number;

    public constructor(private position: CoordXY, private orientation: Orientation, private content: string, private definition: string) {
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

    public get Definition(): string {
        return this.definition;
    }
}
*/
