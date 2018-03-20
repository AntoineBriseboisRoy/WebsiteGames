import { Difficulty } from "../../client/src/app/constants";

export interface INewGame {
    userCreator: string;
    difficulty: Difficulty;
    userJoiner?: string;
}