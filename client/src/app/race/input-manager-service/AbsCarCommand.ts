import { Car } from "../car/car";
import { AbsCommand } from "./AbsCommand";

export abstract class AbsCarCommand extends AbsCommand {
    public constructor(protected car: Car) {
        super();
     }

    public abstract execute(): void;
}
