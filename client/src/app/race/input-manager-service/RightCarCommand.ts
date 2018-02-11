import { Car } from "../car/car";
import { AbsCarCommand } from "./AbsCarCommand";

export class RightCarCommand extends AbsCarCommand {
    public constructor(car: Car) {
        super(car);
    }

    public execute(): void {
        this.car.steerRight();
    }
}
