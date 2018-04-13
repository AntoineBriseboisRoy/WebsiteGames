import { Point } from "../../client/src/app/race/edit-track/Geometry";
export enum TrackType {
    DESERT = "Desert", REGULAR = "Regular"
}

export interface BestTime {
    playerName: string;
    time: Date;
}

export interface ITrack {
    _id: string;
    name: string;
    description: string;
    nTimesPlayed: number;
    bestTimes: BestTime[];
    type: TrackType;
    points: Array<Point>;
}
