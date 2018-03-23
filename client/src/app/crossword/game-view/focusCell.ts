import { ICell } from "../interfaces/ICell";
import { Orientation } from "../../constants";

export class FocusCell {
    private static instance: FocusCell;
    public cell: ICell;
    public cells: Array<ICell>;
    private orientation: Orientation;

    public static get Instance(): FocusCell {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
        this.cells = new Array<ICell>();
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

    public clear(): void {
        this.cell = undefined;
        this.cells = [];
        this.Orientation = undefined;
    }
}
