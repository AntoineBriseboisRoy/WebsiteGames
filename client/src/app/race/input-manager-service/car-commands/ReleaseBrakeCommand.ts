import { Car } from "../../car/car";
import { AbsCarCommand } from "./AbsCarCommand";

export class ReleaseBrakeCommand extends AbsCarCommand {
    public constructor(car: Car) {
        super(car);
     }

    public execute(): void {
        this.car.releaseBrakes();
    }
}
