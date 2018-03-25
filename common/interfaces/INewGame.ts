import { Difficulty } from "../constants";

export interface INewGame {
    userCreator: string;
    difficulty: Difficulty;
    userJoiner?: string;
}