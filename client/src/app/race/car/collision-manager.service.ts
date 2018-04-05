import { Car } from "./car";
import { Vector3, Matrix4, Quaternion, Box3, Mesh, Raycaster, Intersection } from "three";
import { Injectable } from "@angular/core";

const CAR_A_MOMENTUM_FACTOR: number = 2.1;
const CAR_B_MOMENTUM_FACTOR: number = 1.9;
const MIDDLE_SECTION: number = 0.5;
const BACK_SECTION: number = -1.55;
const FRONT_SECTION: number = 1.79;
const COLLISION_DISTANCE: number = 10;

const TIME_THRESHHOLD: number = 200; // Milliseconds
const SLOW_DOWN_FACTOR: number = 0.3;

enum CollisionSide {
    RIGHT = 0,
    LEFT
}

@Injectable()
export class CollisionManager {
    private cars: Car[];
    private roadSegments: Mesh[];
    private startLine: Mesh;
    private timeSinceLastCollision: number;
    private lastDate: number;
    private areCarsCollidingWithStartLine: Array<boolean>;

    public constructor() {
        this.cars = new Array<Car>();
        this.roadSegments = new Array<Mesh>();
        this.startLine = new Mesh();
        this.timeSinceLastCollision = 0;
        this.lastDate = 0;
        this.areCarsCollidingWithStartLine = new Array<boolean>();
    }

    public addCar(car: Car): void {
        this.cars.push(car);
        this.areCarsCollidingWithStartLine.push(false);
    }

    public addRoadSegment(collisionable: Mesh): void {
        this.roadSegments.push(collisionable);
    }

    public setStartLine(collisionable: Mesh): void {
        this.startLine = collisionable;
    }

    public update(): void {
        this.verifyCarCollision();
        this.verifyWallCollision();
        this.verifyStartLineCollision();
    }

    private verifyCarCollision(): void {
        if (this.cars.length > 1) {
            let collisioned: boolean = false;
            const carsCollision: Car[] = new Array<Car>();
            for (let i: number = 0; i < this.cars.length; ++i) {
                carsCollision.push(this.cars[i]);
                for (let j: number = i + 1; j < this.cars.length; ++j) {
                    carsCollision.push(this.cars[j]);
                    const distanceBetweenCars: Vector3 = carsCollision[0].getPosition().clone().sub(carsCollision[1].getPosition().clone());
                    if (this.isNear(distanceBetweenCars)) {
                        collisioned = this.raycasterFindCollision(carsCollision[0], carsCollision[1]);
                        if (!collisioned) {
                            collisioned = this.raycasterFindCollision(carsCollision[1], carsCollision[0]);
                        }
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

    private raycasterFindCollision(carA: Car, carB: Car): boolean {
        let collisioned: boolean = false;
        carA.Raycasters.forEach((raycaster: Raycaster) => {
            const intersections: Intersection[] = raycaster.intersectObject(carB, true);
            if (intersections.length > 0) {
                this.carCollision(carA, carB);
                collisioned = true;
            }
        });

        return collisioned;
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
        this.bounce(car);
        car.speed = car.speed.multiplyScalar(SLOW_DOWN_FACTOR);
    }

    private bounce(car: Car): void {
        car.speed = car.speed.negate();
    }

    private carCollision(carA: Car, carB: Car): void {
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

    private verifyStartLineCollision(): void {
        this.cars.forEach((car: Car, index: number) => {
            const intersections: Intersection[] = car.Raycasters[0].intersectObject(this.startLine);
            if (intersections.length > 0) {
                if (!this.areCarsCollidingWithStartLine[index]) {
                    this.startLineCollision(car);
                    this.areCarsCollidingWithStartLine[index] = true;
                }
            } else {
                this.areCarsCollidingWithStartLine[index] = false;
            }
        });
    }

    private startLineCollision(car: Car): void {
        console.log("Tour complété par" + car.uuid);
        console.log(this.areCarsCollidingWithStartLine);
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
