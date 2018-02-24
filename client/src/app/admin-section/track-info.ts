const UNDEFINED_NAME: string = "Unknown track";
const UNDEFINED_DESCRIPTION: string = "Unknown description.";
const MAX_BEST_TIMES: number = 10;

export enum TrackType {
    DESERT, RAIN, F1, REGULAR
}

export class Track {

    public constructor(private name: string, private description: string, private nPlayed: number,
                       private bestTimes: string[], private type: TrackType) {
        this.name = (name.length > 0) ? name : UNDEFINED_NAME;
        this.description = (description.length) ? description : UNDEFINED_DESCRIPTION;
    }

    public get Name(): string {
        return this.name;
    }

    public get Description(): string {
        return this.description;
    }

    public get NPlayed(): number {
        return this.nPlayed;
    }

    public get BestTimes(): string[] {
        return this.bestTimes;
    }

    public get Type(): TrackType {
        return this.type;
    }

    public addNewTime(newTime: string): void {
        this.bestTimes.push(newTime);
    }
}
