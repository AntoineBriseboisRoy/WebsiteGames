import { AbsCommand } from "../AbsCommand";

export abstract class AbsGridCommand extends AbsCommand {
    public constructor(/*protected car: Car*/) {
        super();
     }

    public abstract execute(): void;
}
