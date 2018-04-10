import { AbsCarCommand } from "./AbsCarCommand";
import { Car } from "../../car/car";

export class ToggleCarLightsCommand extends AbsCarCommand {
    public constructor(car: Car) {
        super(car);
    }

    public execute(): void {
        this.car.toggleHeadlights();
    }
}
