export enum TrackType {
    DESERT = "Desert", RAIN = "Rain", F1 = "F1", REGULAR = "Regular"
}

export interface ITrack {
    _id: string;
    name: string;
    description: string;
    nTimesPlayed: number;
    bestTimes: string[];
    type: TrackType;
}
