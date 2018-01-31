export class Position{
    
    constructor(private x:number, private y:number){

    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }

    update(lenght:number,width:number){
        this.x += lenght;
        if(this.x >= width) { 
            this.x %= width;
            this.y++;
        }
    }
}