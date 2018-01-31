import { OnInit } from '@angular/core';
import {Difficulty} from '../constants'


//it would be a great idea to make this class a singleton
export class GameManager implements OnInit {
    constructor(private difficulty:Difficulty, private twoPlayer: boolean) { }

    ngOnInit() {
        
    }

    getDifficulty() : string{
        return this.difficulty;
    }

    isMultiplayer(){
        return this.twoPlayer;
    }
}