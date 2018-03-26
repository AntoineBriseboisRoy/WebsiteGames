import { Point } from "../../client/src/app/race/edit-track/Geometry";
export enum TrackType {
    DESERT = "Desert", REGULAR = "Regular"
}

export interface ITrack {
    _id: string;
    name: string;
    description: string;
    nTimesPlayed: number;
    bestTimes: string[];
    type: TrackType;
    points: Array<Point>;
}
