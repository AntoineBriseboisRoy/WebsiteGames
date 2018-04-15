import { IPlayer } from "./IPlayer";
import {GameOutcome} from "../constants";
export interface IEndGame {
    Loser?: IPlayer;
    Winner?: IPlayer;
    Outcome: GameOutcome;
}