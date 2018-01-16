enum Orientation {
    Horizontal = 0,
    Vertical
}

class Word {
    constructor(private name : string, private pos : PosXY, private length : number, private orientation : Orientation,
                    private content : string) {}


}