import { Vector3 } from "three";

export interface IPhysicsObject {
    mass: number;
    dragCoefficient: number;
    frontalSurface: number;
    frictionCoefficient: number;
    initialForce: number;
    weightRear: number;
    nContactPoints: number;
    nRearContactPoints: number;
    direction: Vector3;
    up: Vector3;
    speed: Vector3;
    isAccelerating: Boolean;
    isDecelerating: Boolean;
}

export interface IRotationalObject {
    radius: number;
    inertia: number;
}
