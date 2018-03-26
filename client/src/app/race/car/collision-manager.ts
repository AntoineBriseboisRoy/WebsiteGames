import { Car } from "./car";
import { Vector3, Matrix4, Quaternion, Box3, Mesh, Raycaster, Intersection } from "three";
import { Injectable } from "@angular/core";

const CAR_A_MOMENTUM_FACTOR: number = 2.1;
const CAR_B_MOMENTUM_FACTOR: number = 1.9;
const MIDDLE_SECTION: number = 0.5;
const BACK_SECTION: number = -1.55;
const FRONT_SECTION: number = 1.79;

const TIME_THRESHHOLD: number = 200; // Milliseconds

@Injectable()
export class CollisionManager {

    private cars: Car[];
    private roadSegments: Mesh[];
    private timeSinceLastCollision: number;
    private lastDate: number;

    public constructor() {
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
            let didACollision: boolean = false;
            const carsCollision: Car[] = new Array<Car>();
            for (let i: number = 0; i < this.cars.length; ++i) {
                carsCollision.push(this.cars[i]);
                for (let j: number = i + 1; j < this.cars.length; ++j) {
                    carsCollision.push(this.cars[j]);
                    carsCollision[0].Raycasters.forEach((raycaster: Raycaster) => {
                        const intersections: Intersection[] = raycaster.intersectObject(carsCollision[1], true);
                        if (intersections.length > 0) {
                            didACollision = true;
                            this.carCollision(carsCollision[0], carsCollision[1]);
                        }
                    });
                    if (!didACollision) {
                        carsCollision[1].Raycasters.forEach((raycaster: Raycaster) => {
                            const intersections: Intersection[] = raycaster.intersectObject(carsCollision[0], true);
                            if (intersections.length > 0) {
                                this.carCollision(carsCollision[0], carsCollision[1]);
                            }
                        });
                    }
                    didACollision = false;
                    carsCollision.pop();
                }
                carsCollision.pop();
            }
        }
        // tslint:disable-next-line:prefer-for-of

    }

    private verifyWallCollision(): void {
        this.cars.forEach((car: Car) => {
            car.Raycasters.forEach((raycaster: Raycaster) => {
                const intersections: Intersection[] = raycaster.intersectObjects(this.roadSegments);
                if (intersections.length === 0) { // Car is no more in contact with the road.
                    this.timeSinceLastCollision += Date.now() - this.lastDate;
                    if (this.timeSinceLastCollision > TIME_THRESHHOLD) {
                        this.timeSinceLastCollision = 0;
                        // this.wallCollision(car);
                    }
                    this.lastDate = Date.now();
                }
            });
        });
    }

    private wallCollision(car: Car): void {
        this.bounce(car);
        car.speed = car.speed.multiplyScalar(0.3);
    }

    private bounce(car: Car): void {
        car.speed = car.speed.negate();
    }

    // tslint:disable-next-line:max-func-body-length
    private carCollision(carA: Car, carB: Car): void {
        const massA: number = carA.Mass;
        const massB: number = carB.Mass;
        const speedA: Vector3 = carA.speed;
        const speedB: Vector3 = carB.speed;

        const intersectBox: Box3 =  carA.BoundingBox.intersect(carB.BoundingBox);
        const deltaA: Vector3 = carA.getPosition().clone().sub(intersectBox.getCenter());
        const deltaB: Vector3 = carB.getPosition().clone().sub(intersectBox.getCenter());
        this.spinCar(carA, deltaA);
        this.spinCar(carB, deltaB);

        const rotationA: Matrix4 = new Matrix4();
        rotationA.extractRotation(carA.getMeshMatrix());
        const rotationQuaternionA: Quaternion = new Quaternion();
        rotationQuaternionA.setFromRotationMatrix(rotationA);
        speedA.applyMatrix4(rotationA);

        const rotationB: Matrix4 = new Matrix4();
        rotationB.extractRotation(carB.getMeshMatrix());
        const rotationQuaternionB: Quaternion = new Quaternion();

        rotationQuaternionB.setFromRotationMatrix(rotationB);
        speedB.applyMatrix4(rotationB);

        const totalSystemMomentum: Vector3 = speedA.multiplyScalar(massA).add(speedB.multiplyScalar(massB));

        let carANewSpeed: Vector3 = new Vector3(totalSystemMomentum.x / massA / CAR_A_MOMENTUM_FACTOR,
                                                totalSystemMomentum.y / massA / CAR_A_MOMENTUM_FACTOR,
                                                totalSystemMomentum.z / massA / CAR_A_MOMENTUM_FACTOR);
        let carBNewSpeed: Vector3 = new Vector3(totalSystemMomentum.x / massB / CAR_B_MOMENTUM_FACTOR,
                                                totalSystemMomentum.y / massB / CAR_B_MOMENTUM_FACTOR,
                                                totalSystemMomentum.z / massB / CAR_B_MOMENTUM_FACTOR);

        carANewSpeed = carANewSpeed.applyQuaternion(rotationQuaternionA.inverse());
        carBNewSpeed = carBNewSpeed.applyQuaternion(rotationQuaternionB.inverse());

        carA.speed = carANewSpeed;
        carB.speed = carBNewSpeed;
    }

    private spinCar(car: Car, delta: Vector3): void {
        if (delta.z > 0) {
            this.rightSideCollision(car, delta.x);
        } else {
            this.leftSideCollision(car, delta.x);
        }
    }

    private rightSideCollision(car: Car, deltaX: number): void {
        if (deltaX < -MIDDLE_SECTION) {
            if (deltaX > BACK_SECTION) {
                console.log("back-right-side");
                car.steerRight();
            } else {
                console.log("back-right-back");
                car.steerLeft();
            }
        } else if (deltaX > MIDDLE_SECTION) {
            if (deltaX < FRONT_SECTION) {
                console.log("front-right-side");
                car.steerLeft();
            } else {
                console.log("front-right-front");
                car.steerRight();
            }
        }
    }

    private leftSideCollision(car: Car, deltaX: number): void {
        if (deltaX < -MIDDLE_SECTION) {
            if (deltaX > BACK_SECTION) {
                console.log("back-left-side");
                car.steerLeft();
            } else {
                console.log("back-left-back");
                car.steerRight();
            }
        } else if (deltaX > MIDDLE_SECTION) {
            if (deltaX < FRONT_SECTION) {
                console.log("front-left-side");
                car.steerRight();
            } else {
                console.log("front-left-front");
                car.steerLeft();
            }
        }
    }
}
