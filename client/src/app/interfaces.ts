import { Vector2 } from "three";

export interface ILapInformation {
    lap: number;
    lapTimes: Array<Date>;
    totalTime: Date;
}

export interface ICheckpointInformation {
    checkpoints: Array<[Vector2, Vector2]>;
    nextCheckpoint: number;
    precedentDistanceToNextCheckpoint: number;
    distanceToNextCheckpoint: number;
    isGoingForward: boolean;
    checkpointCounter: number;
}
