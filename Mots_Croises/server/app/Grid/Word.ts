enum Orientation {
    Horizontal = 0,
    Vertical
}

class Word {

    constructor(private position : PosXY, private length : number,
                private orientation : Orientation, private content : string) { }

    public getPosition() : PosXY {
        return this.position;
    }

    public getLength() : number {
        return this.length;
    }

    public getOrientation() : Orientation {
        return this.orientation;
    }

    public getContent() : string {
        return this.content;
    }
}