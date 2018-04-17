import { Point } from "../../client/src/app/race/edit-track/Geometry";
export enum TrackType {
    DESERT = "Desert", REGULAR = "Regular"
}

export interface IBestTime {
    playerName: string;
    time: Date;
}

export interface ITrack {
    _id: string;
    name: string;
    description: string;
    nTimesPlayed: number;
    bestTimes: IBestTime[];
    type: TrackType;
    points: Array<Point>;
}
