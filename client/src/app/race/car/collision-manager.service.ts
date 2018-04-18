import { Car } from "./car";
import { Vector3, Matrix4, Quaternion, Box3, Mesh, Raycaster, Intersection } from "three";
import { Injectable } from "@angular/core";
import { SoundManagerService } from "../sound-manager.service";
import { COLLISION_SOUND_NAME, WALL_SOUND_NAME, LAP_NUMBER } from "../../constants";
import { ModalService } from "../../modal/modal.service";
import { Router } from "@angular/router";
import { InputManagerService } from "../input-manager-service/input-manager.service";
import { CarAI } from "./car-ai";

const CAR_A_MOMENTUM_FACTOR: number = 2.1;
const CAR_B_MOMENTUM_FACTOR: number = 1.9;
const MIDDLE_SECTION: number = 0.5;
const BACK_SECTION: number = -1.55;
const FRONT_SECTION: number = 1.79;
const COLLISION_DISTANCE: number = 10;
const TIME_THRESHHOLD: number = 100; // Milliseconds
const SLOW_DOWN_FACTOR: number = 0.3;
const MODAL_PADDING: number = 2;

enum CollisionSide {
    RIGHT = 0,
    LEFT
}

@Injectable()
export class CollisionManager {
    private cars: Car[];
    private roadSegments: Mesh[];
    private checkpoints: Mesh[];
    private startLine: Mesh;
    private timeSinceLastCollision: number;
    private lastDate: number;
    private areCarsCollidingWithStartLine: Array<boolean>;
    private areCarsCollidingWithCheckpoints: Array<Array<boolean>>;

    public constructor(private soundManager: SoundManagerService, private modalService: ModalService, private router: Router,
                       private inputManagerService: InputManagerService) {
        this.cars = new Array<Car>();
        this.roadSegments = new Array<Mesh>();
        this.checkpoints = new Array<Mesh>();
        this.startLine = new Mesh();
        this.timeSinceLastCollision = 0;
        this.lastDate = 0;
        this.areCarsCollidingWithStartLine = new Array<boolean>();
        this.areCarsCollidingWithCheckpoints = new Array<Array<boolean>>();
    }

    public addCar(car: Car): void {
        this.cars.push(car);
        this.areCarsCollidingWithStartLine.push(false);
        this.areCarsCollidingWithCheckpoints.push(Array<boolean>());
    }

    public addRoadSegment(collisionable: Mesh): void {
        this.roadSegments.push(collisionable);
    }

    public addCheckpoint(collisionable: Mesh): void {
        this.checkpoints.push(collisionable);
        this.areCarsCollidingWithCheckpoints.forEach((carArray) => carArray.push(false));
    }

    public setStartLine(collisionable: Mesh): void {
        this.startLine = collisionable;
    }

    public update(): void {
        this.verifyCarCollision();
        this.verifyWallCollision();
        this.verifyStartLineCollision();
        this.verifyCheckpointCollision();
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
        (car as CarAI).isStuck =  true;
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
        if (car.Information.Lap === LAP_NUMBER) {
            car.Information.stopTimer();
            if (car === this.cars[0]) {
                this.endRace();
            }
        }
        car.Information.completeALap();
    }

    private verifyCheckpointCollision(): void {
        this.cars.forEach((car: Car, indexCar: number) => {
            this.checkpoints.forEach((checkpoint, indexCheckpoint: number) => {
                const intersections: Intersection[] = car.Raycasters[0].intersectObject(checkpoint);
                if (intersections.length > 0) {
                    if (!this.areCarsCollidingWithCheckpoints[indexCar][indexCheckpoint]) {
                        this.checkpointCollision(car, indexCheckpoint);
                        this.areCarsCollidingWithCheckpoints[indexCar][indexCheckpoint] = true;
                    }
                } else {
                    this.areCarsCollidingWithCheckpoints[indexCar][indexCheckpoint] = false;
                }
            });
        });
    }

    private checkpointCollision(car: Car, indexCheckpoint: number): void {
        car.Information.setNextCheckpoint((indexCheckpoint + 1) % this.checkpoints.length);
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

    private endRace(): void  {
        this.inputManagerService.deactivate();
        this.openEndRaceModal();
    }

    private openEndRaceModal(): void {
        if (!this.modalService.IsOpen) {
            this.modalService.open({
                title: "Race Over!", message: "Your time is " +
                    this.cars[0].Information.totalTime.getMinutes().toString().padStart(MODAL_PADDING, "0") + ":" +
                    this.cars[0].Information.totalTime.getSeconds().toString().padStart(MODAL_PADDING, "0") + ":" +
                    this.cars[0].Information.totalTime.getMilliseconds().toString().padEnd(MODAL_PADDING, "0").substr(0, MODAL_PADDING) +
                    "! You can choose to replay or go back to home page",
                firstButton: "Race again!", secondButton: "Home", showPreview: true
            })
            .then(() => window.location.reload(), () => {
                this.router.navigate([""]);
                window.location.reload();
            });
        }
    }
}
