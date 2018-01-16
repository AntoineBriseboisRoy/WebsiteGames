const BLACKSQUARE_CHARACTER : string = "*";

class Grid {

    gridContent : Array<Array<String>>;
    blackSquares : BlackSquare[];
    words : Word[];

    constructor(private size : number) {}

    generateBlackSquares(percentage : number) : void {
                
    }

    randomPositionGenrator() : PosXY {
        let tempPosition = new PosXY(0, 0);
        while("occupiedPos"){
            
        }
        return new PosXY(0, 0);
    }

    randomIntGenerator(max: number) : number {
        return Math.floor(Math.random() * max + 1);
    }

}