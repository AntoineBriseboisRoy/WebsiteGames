import { Car } from "../../car/car";
import { AbsCarCommand } from "./AbsCarCommand";

export class BrakeCarCommand extends AbsCarCommand {
    public constructor(car: Car) {
        super(car);
     }

    public execute(): void {
        this.car.brake();
    }
}
