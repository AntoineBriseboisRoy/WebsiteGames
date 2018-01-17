const BLACKSQUARE_CHARACTER : string = "*"; //A centraliser

class Grid {

    private gridContent : Array<Array<String>>;
    private blackSquares : BlackSquare[];
    private words : Word[];

    constructor(private sideSize : number, private percentageOfBlackSquares : number) { }

    public getGridContent() : Array<Array<String>> {
        return this.gridContent;
    }

    public getBlackSquares() : BlackSquare[] {
        return this.blackSquares;
    }

    public getWords() : Word[] {
        return this.words;
    }

    //Make sure there are not too many consecutive squares. Modify so that an unequal number of squares per line is possible.
    //blackSquares^T = blackSquares
    private generateBlackSquares() : void {
        let numberOfBlackSquaresPerLine = this.percentageOfBlackSquares * this.sideSize;
        for (let i = 0; i < numberOfBlackSquaresPerLine; i++) {
            for (let j = 0; j < numberOfBlackSquaresPerLine; j++) {
                let tempPosition = this.randomPositionGenerator();
                this.blackSquares.push(new BlackSquare(tempPosition))
                this.gridContent[tempPosition.getX()][tempPosition.getY()] = BLACKSQUARE_CHARACTER;
            }
        }
    }

    private randomPositionGenerator() : PosXY {
        let tempPosition = new PosXY(this.randomIntGenerator(), this.randomIntGenerator());

        while(this.isOccupiedPosition(tempPosition)){
            tempPosition = new PosXY(this.randomIntGenerator(), this.randomIntGenerator());
        }
        return tempPosition;
    }

    private randomIntGenerator() : number {
        return Math.floor(Math.random() * this.sideSize);
    }

    // No need to verify if there are letters, as they havent been placed yet
    private isOccupiedPosition(position : PosXY) : boolean {
        this.blackSquares.forEach(square => {
            if(square.getPosition().equals(position)){
                return true;
            }
        });
        return false;
    }
}