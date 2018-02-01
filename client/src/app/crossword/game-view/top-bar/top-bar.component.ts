import { Component, OnInit } from '@angular/core';
import {GameManager} from '../../game-manager'
import {Difficulty} from '../../../constants'
import {PlayerInformationComponent} from '../player-information/player-information.component'

@Component({
  selector: 'crossword-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  private gameManager:GameManager= new GameManager(Difficulty.Normal, true);
  private player: PlayerInformationComponent = new PlayerInformationComponent();
  constructor() { }
  ngOnInit() {
  }
  modeToString():string{
    return this.gameManager.isMultiplayer()?"Two Players":"Single Player";
  }
}
