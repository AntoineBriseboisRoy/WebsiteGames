import { IWord } from "./IWord";

export interface IGameInProgress {
    gridWords: Array<IWord>;
    gridContent: any;
    roomName: string;
}