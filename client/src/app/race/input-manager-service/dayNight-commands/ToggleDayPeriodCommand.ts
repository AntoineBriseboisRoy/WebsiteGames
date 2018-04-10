import { AbsCommand } from "../AbsCommand";
import { DayPeriodContext } from "../../dayToggle-context";

export class ToggleDayPeriodCommand extends AbsCommand {
    public constructor(private dayPeriodContext: DayPeriodContext) {
        super();
    }

    public execute(): void {
        this.dayPeriodContext.togglePeriod();
    }
}
