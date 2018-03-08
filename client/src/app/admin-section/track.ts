const UNDEFINED_NAME: string = "Unknown track";
const UNDEFINED_DESCRIPTION: string = "Unknown description.";

export enum TrackType {
    DESERT = "Desert", RAIN = "Rain", F1 = "F1", REGULAR = "Regular"
}

export class Track {

    public constructor(private _id: string, private name: string, private description: string, private nTimesPlayed: number,
                       private bestTimes: string[], private type: TrackType) {
        this.name = (name.length > 0) ? name : UNDEFINED_NAME;
        this.description = (description.length > 0) ? description : UNDEFINED_DESCRIPTION;
    }

    public get Name(): string {
        return this.name;
    }

    public get Description(): string {
        return this.description;
    }

    public get NTimesPlayed(): number {
        return this.nTimesPlayed;
    }

    public get BestTimes(): string[] {
        return this.bestTimes;
    }

    public get Type(): TrackType {
        return this.type;
    }

    public addNewBestTime(newTime: string): void {
        this.bestTimes.push(newTime);
    }
}
