import { OnInit } from "@angular/core";
import { GridService } from "../grid.service";
import { ICell } from "../interfaces/ICell";
import { Orientation } from "../../constants";

export class FocusCell implements OnInit {
    private static instance: FocusCell;
    private cell: ICell;
    private orientation: Orientation;

    public static get Instance(): FocusCell {
        return this.instance || (this.instance = new this());
    }

    private constructor() {
    }

    public ngOnInit(): void {
    }

    public get Cell(): ICell {
        return this.cell;
    }

    public set Cell(cell: ICell) {
        this.cell = cell;
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
