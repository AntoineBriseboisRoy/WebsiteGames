import { Injectable } from "@angular/core";
import { Vector3 } from "three";
import { GRAVITY } from "../../constants";
import { IPhysicsObject, IRotationalObject } from "./physics-interfaces";

const AIR_DENSITY: number = 1.2;
const MINIMUM_SPEED: number = 0.05;

@Injectable()
export class ForcesManager {

    public static getAcceleration(object: IPhysicsObject): Vector3 {
        return ForcesManager.computeResultingForce(object).divideScalar(object.mass);
    }

    public static getAngularAcceleration(object: IPhysicsObject, rotatingObject: IRotationalObject): number {
        return ForcesManager.getTotalTorque(object, rotatingObject) /
               (rotatingObject.inertia * object.nRearContactPoints);
    }

    public static getDeltaSpeed(object: IPhysicsObject, deltaTime: number): Vector3 {
        return ForcesManager.getAcceleration(object).multiplyScalar(deltaTime);
    }

    public static getDeltaPosition(object: IPhysicsObject, deltaTime: number): Vector3 {
        return object.speed.multiplyScalar(deltaTime);
    }

    private static computeResultingForce(object: IPhysicsObject): Vector3 {
        const resultingForce: Vector3 = new Vector3();

        // if (object.speed.length() >= MINIMUM_SPEED) {
        //     const dragForce: Vector3 = ForcesManager.getDragForce(object);
        //     const rollingResistance: Vector3 = ForcesManager.getRollingResistance(object);
        //     const friction: Vector3 = ForcesManager.getLatteralFrictionForce(object);
        //     resultingForce.add(dragForce).add(rollingResistance).add(friction);
        // }

        if (object.isAccelerating) {
            const tractionForce: number = ForcesManager.getTractionForce(object);
            const accelerationForce: Vector3 = object.direction;
            accelerationForce.multiplyScalar(tractionForce);
            resultingForce.add(accelerationForce);
        } else if (object.isDecelerating && ForcesManager.isGoingForward(object)) {
            const brakeForce: Vector3 = ForcesManager.getBrakeForce(object);
            resultingForce.add(brakeForce);
        }

        return resultingForce;
    }

    private static getLatteralFrictionForce(object: IPhysicsObject): Vector3 {
        const sideways: Vector3 = object.direction.cross(object.up);
        const sidewaysSpeed: Vector3 = sideways.normalize().multiplyScalar(object.speed.dot(sideways));
        const frictionCoefficient: number = 0.05;

        return sidewaysSpeed.normalize().multiplyScalar(frictionCoefficient * GRAVITY * object.mass);
    }

    private static getRollingResistance(object: IPhysicsObject): Vector3 {
        // formula adapted from: https://www.engineeringtoolbox.com/rolling-friction-resistance-d_1303.html
        // tslint:disable-next-line:no-magic-numbers
        const rollingCoefficient: number = (Math.pow(object.speed.length() * 3.6 / 100, 2) * 0.0095 + 0.01) + 0.005;

        return object.direction.multiplyScalar(rollingCoefficient * object.mass * GRAVITY * ForcesManager.isGoingBackwards(object));
    }

    private static getDragForce(object: IPhysicsObject): Vector3 {
        const resistance: Vector3 = object.direction;
        resistance.multiplyScalar(AIR_DENSITY * object.frontalSurface * -object.dragCoefficient *
                                  object.speed.length() * object.speed.length() * ForcesManager.isGoingBackwards(object));

        return resistance;
    }

    public static getTractionForce(object: IPhysicsObject): number {
        const maxForce: number = object.frictionCoefficient * object.mass * GRAVITY *
                                 object.weightRear * object.nRearContactPoints /
                                 object.nContactPoints;

        return -Math.min(object.initialForce, maxForce);
    }

    private static isGoingBackwards(object: IPhysicsObject): number {
        return Math.sign(object.speed.dot(object.direction.normalize()));
    }

    private static isGoingForward(object: IPhysicsObject): boolean {
        // tslint:disable-next-line:no-magic-numbers
        return object.speed.normalize().dot(object.direction) > 0.05;
    }

    private static getBrakeTorque(object: IPhysicsObject, rotatingObject: IRotationalObject): number {
        return ForcesManager.getBrakeForce(object).length() * rotatingObject.radius;
    }

    private static getTractionTorque(object: IPhysicsObject, rotatingObject: IRotationalObject): number {
        return ForcesManager.getTractionForce(object) * rotatingObject.radius;
    }

    private static getTotalTorque(object: IPhysicsObject, rotatingObject: IRotationalObject): number {
        return ForcesManager.getTractionTorque(object, rotatingObject) * object.nRearContactPoints +
               ForcesManager.getBrakeTorque(object, rotatingObject);
    }

    private static getBrakeForce(object: IPhysicsObject): Vector3 {
        return object.direction.multiplyScalar(object.frictionCoefficient * object.mass * GRAVITY);
    }
}
