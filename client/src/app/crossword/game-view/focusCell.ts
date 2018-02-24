import { ICell } from "../interfaces/ICell";
import { Orientation } from "../../constants";

export class FocusCell {
    private static instance: FocusCell;
    private cell: ICell;
    private cells: Array<ICell>;
    private orientation: Orientation;

    public static get Instance(): FocusCell {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        this.cells = new Array();
    }

    public get Cell(): ICell {
        return this.cell;
    }

    public set Cell(cell: ICell) {
        this.cell = cell;
    }

    public get Cells(): Array<ICell> {
        return this.cells;
    }

    public set Cells(cells: Array<ICell>) {
        this.cells = cells;
    }

    public get Orientation(): Orientation {
        return this.orientation;
    }

    public set Orientation(orientation: Orientation) {
        this.orientation = orientation;
    }

    public invertOrientation(): void {
        this.Orientation = this.Orientation === Orientation.Horizontal ? Orientation.Vertical : Orientation.Horizontal;
    }
}
