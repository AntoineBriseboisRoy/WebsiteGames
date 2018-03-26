import { Difficulty } from "../constants";

export interface INewGame {
    userCreator: string;
    difficulty: Difficulty;
    userCreatorID: string;
    userJoiner: string;
}