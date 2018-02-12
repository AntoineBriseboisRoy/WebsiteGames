import { Car } from "../car/car";

export abstract class AbsCommand {
    public constructor() {
    }
    public abstract execute(): void;
}
