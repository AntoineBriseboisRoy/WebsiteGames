import { Car } from "./car";
import { Vector3, Matrix4, Quaternion, Box3, Mesh, Raycaster, Intersection } from "three";
import { Injectable } from "@angular/core";
import { SoundManagerService } from "../sound-manager.service";
import { COLLISION_SOUND_NAME, WALL_SOUND_NAME } from "../../constants";

const CAR_A_MOMENTUM_FACTOR: number = 2.1;
const CAR_B_MOMENTUM_FACTOR: number = 1.9;
const MIDDLE_SECTION: number = 0.5;
const BACK_SECTION: number = -1.55;
const FRONT_SECTION: number = 1.79;
const COLLISION_DISTANCE: number = 10;

const TIME_THRESHHOLD: number = 100; // Milliseconds
const SLOW_DOWN_FACTOR: number = 0.3;

enum CollisionSide {
    RIGHT = 0,
    LEFT
}

@Injectable()
export class CollisionManager {

    private cars: Car[];
    private roadSegments: Mesh[];
    private timeSinceLastCollision: number;
    private lastDate: number;

    public constructor(private soundManager: SoundManagerService) {
        this.cars = new Array<Car>();
        this.roadSegments = new Array<Mesh>();
        this.timeSinceLastCollision = 0;
        this.lastDate = 0;
    }

    public addCar(car: Car): void {
        this.cars.push(car);
    }

    public addRoadSegment(collisionable: Mesh): void {
        this.roadSegments.push(collisionable);
    }

    public update(): void {
        this.verifyCarCollision();
        this.verifyWallCollision();
    }

    private verifyCarCollision(): void {
        if (this.cars.length > 1) {
            const carsCollision: Car[] = new Array<Car>();
            for (let i: number = 0; i < this.cars.length; ++i) {
                carsCollision.push(this.cars[i]);
                for (let j: number = i + 1; j < this.cars.length; ++j) {
                    carsCollision.push(this.cars[j]);
                    const distanceBetweenCars: Vector3 = carsCollision[0].getPosition().clone().sub(carsCollision[1].getPosition().clone());
                    if (this.isNear(distanceBetweenCars)) {
                        this.raycasterFindCollision(carsCollision[0], carsCollision[1]);
                    }
                    carsCollision.pop();
                }
                carsCollision.pop();
            }
        }
    }

    private isNear(distance: Vector3): boolean {
        return Math.abs(distance.x) < COLLISION_DISTANCE ||
               Math.abs(distance.z) < COLLISION_DISTANCE;
    }

    private raycasterFindCollision(carA: Car, carB: Car): void {
        carA.Raycasters.forEach((raycaster: Raycaster) => {
            const intersections: Intersection[] = raycaster.intersectObject(carB, true);
            if (intersections.length > 0) {
                this.carCollision(carA, carB);
            }
        });
    }

    private verifyWallCollision(): void {
        this.cars.forEach((car: Car) => {
            car.Raycasters.forEach((raycaster: Raycaster) => {
                const intersections: Intersection[] = raycaster.intersectObjects(this.roadSegments);
                if (intersections.length === 0) {
                    this.timeSinceLastCollision += Date.now() - this.lastDate;
                    if (this.timeSinceLastCollision > TIME_THRESHHOLD) {
                        this.timeSinceLastCollision = 0;
                        this.wallCollision(car);
                    }
                    this.lastDate = Date.now();
                }
            });
        });
    }

    private wallCollision(car: Car): void {
        this.soundManager.play(WALL_SOUND_NAME);
        this.bounce(car);
        car.speed = car.speed.multiplyScalar(SLOW_DOWN_FACTOR);
    }

    private bounce(car: Car): void {
        car.speed = car.speed.negate();
    }

    private carCollision(carA: Car, carB: Car): void {
        this.soundManager.play(COLLISION_SOUND_NAME);
        const intersectBox: Box3 =  carA.BoundingBox.intersect(carB.BoundingBox);
        this.spinCar(carA, carA.getPosition().clone().sub(intersectBox.getCenter()));
        this.spinCar(carB, carB.getPosition().clone().sub(intersectBox.getCenter()));

        const speedA: Vector3 = this.getWorldCoordinatesSpeed(carA);
        const speedB: Vector3 = this.getWorldCoordinatesSpeed(carB);

        const totalSystemMomentum: Vector3 = speedA.multiplyScalar(carA.Mass).add(speedB.multiplyScalar(carB.Mass));

        const carANewSpeed: Vector3 = new Vector3(totalSystemMomentum.x / carA.Mass / CAR_A_MOMENTUM_FACTOR,
                                                  totalSystemMomentum.y / carA.Mass / CAR_A_MOMENTUM_FACTOR,
                                                  totalSystemMomentum.z / carA.Mass / CAR_A_MOMENTUM_FACTOR);
        const carBNewSpeed: Vector3 = new Vector3(totalSystemMomentum.x / carB.Mass / CAR_B_MOMENTUM_FACTOR,
                                                  totalSystemMomentum.y / carB.Mass / CAR_B_MOMENTUM_FACTOR,
                                                  totalSystemMomentum.z / carB.Mass / CAR_B_MOMENTUM_FACTOR);

        carA.speed = this.getCarCoordinatesSpeed(carA, carANewSpeed);
        carB.speed = this.getCarCoordinatesSpeed(carB, carBNewSpeed);
    }

    private getWorldCoordinatesSpeed(car: Car): Vector3 {
        const rotation: Matrix4 = new Matrix4();
        rotation.extractRotation(car.getMeshMatrix());

        return car.speed.clone().applyMatrix4(rotation);
    }

    private getCarCoordinatesSpeed(car: Car, newSpeed: Vector3): Vector3 {
        const rotation: Matrix4 = new Matrix4();
        rotation.extractRotation(car.getMeshMatrix());

        const rotationQuaternion: Quaternion = new Quaternion();
        rotationQuaternion.setFromRotationMatrix(rotation);

        return newSpeed.applyQuaternion(rotationQuaternion.inverse());
    }

    private spinCar(car: Car, delta: Vector3): void {
        const collisionSide: CollisionSide = (delta.z > 0) ? CollisionSide.RIGHT : CollisionSide.LEFT;

        if (delta.x < -MIDDLE_SECTION) {
            if (delta.x > BACK_SECTION) {
                collisionSide === CollisionSide.RIGHT ? car.steerRight() : car.steerLeft();
            } else {
                collisionSide === CollisionSide.RIGHT ? car.steerLeft() : car.steerRight();
            }
        } else if (delta.x > MIDDLE_SECTION) {
            if (delta.x < FRONT_SECTION) {
                collisionSide === CollisionSide.RIGHT ? car.steerLeft() : car.steerRight();
            } else {
                collisionSide === CollisionSide.RIGHT ? car.steerRight() : car.steerLeft();
            }
        }
    }
}
