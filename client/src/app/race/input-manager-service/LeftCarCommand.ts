import { AbsCarCommand } from "./AbsCarCommand";
import { Car } from "../car/car";

export class LeftCarCommand extends AbsCarCommand {
    public constructor(car: Car) {
        super(car);
    }

    public execute(): void {
        this.car.steerLeft();
    }
}
