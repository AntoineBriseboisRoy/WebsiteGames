import { Cell } from "./cell";
import {Orientation} from "../../../constants";

export class GridWord {

    public constructor(private cells: Array<Cell>, private correctAnswer: string, private definition: string,
                       private orientation: Orientation) { // cells par référence ou copie ???
    }
}
