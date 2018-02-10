import { Car } from "../car/car";

export abstract class AbsCarCommand {
    public constructor(protected car: Car) { }

    public abstract execute(): void;
}
