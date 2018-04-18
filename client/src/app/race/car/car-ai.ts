import { Car } from "./car";
import { Vector2, Vector3, Matrix3 } from "three";

const MINIMUM_ANGLE_FOR_STEERING: number = 0.1;
const BRAKING_DISTANCE: number = 0.2;
const DISTANCE_FROM_CENTER: number = 7;
const BACKWARD_DISTANCE: number = 10;

export class CarAI extends Car {
    public isInitialized: boolean;
    public hasCollidedWithWall: boolean;
    private positionAtCollisionPoint: Vector3;
    private isMovingAwayFromEdges: boolean;

    public constructor() {
        super();
        this.isInitialized = false;
        this.hasCollidedWithWall = false;
        this.positionAtCollisionPoint = undefined;
        this.isMovingAwayFromEdges = false;
    }

    private steer(): void {
        if (this.angleBetweenTrackAndCarDirection() < MINIMUM_ANGLE_FOR_STEERING) {
            this.checkToMoveAwayFromEdges();
        } else {
            this.checkToAlignCarWithTrack();
        }
        this.checkToChangeIsMovingAwayFromEdges();
    }

    private checkToMoveAwayFromEdges(): void {
        if (this.shortestDistanceFromCarToMiddleOfRoad() >= DISTANCE_FROM_CENTER) {
            this.moveAwayFromEdges();
        } else {
            this.isMovingAwayFromEdges = false;
            this.releaseSteering();
        }
    }

    private checkToAlignCarWithTrack(): void {
        if (!this.isMovingAwayFromEdges) {
            this.alignCarDirectionWithTrackDirection();
        }
    }
    private checkToChangeIsMovingAwayFromEdges(): void {
        if (this.shortestDistanceFromCarToMiddleOfRoad() < DISTANCE_FROM_CENTER) {
            this.isMovingAwayFromEdges = false;
        }
    }

    private moveAwayFromEdges(): void {
        this.isMovingAwayFromEdges = true;
        if (this.isCarOnLeftSideOfRoad()) {
            this.steerRight();
        } else {
            this.steerLeft();
        }
    }

    private alignCarDirectionWithTrackDirection(): void {
        if (this.isCarDirectionLeftOfTrackDirection()) {
            this.steerRight();
        } else {
            this.steerLeft();
        }
    }

    private isCarDirectionLeftOfTrackDirection(): boolean {
        return this.trackDirection().x * this.direction.z - this.trackDirection().y * this.direction.x < 0;
    }

    private shortestDistanceFromCarToMiddleOfRoad(): number {
        const previousCheckpoint: number = this.Information.NextCheckpoint - 1 < 0 ? this.Information.Checkpoints.length - 1 :
                                                                                     this.Information.NextCheckpoint - 1;

        return Math.abs(this.trackDirection().y * this.getPosition().x -
                        this.trackDirection().x * this.getPosition().z +
                        this.Information.IntersectionPositions[this.Information.NextCheckpoint].x *
                        this.Information.IntersectionPositions[previousCheckpoint].y -
                        this.Information.IntersectionPositions[this.Information.NextCheckpoint].y *
                        this.Information.IntersectionPositions[previousCheckpoint].x) /
                        this.trackDirection().length();
    }

    private angleBetweenTrackAndCarDirection(): number {
        const carDirection: Vector2 = new Vector2(this.direction.x, this.direction.z).normalize();
        if (carDirection.length() === 0) {
            return 0;
        }

        return Math.acos(this.trackDirection().dot(carDirection) / (this.trackDirection().length() * carDirection.length()));
    }

    private brakingDistance(): number {
        return this.speed.length() * BRAKING_DISTANCE;
    }

    private collisionRoutine(): void {
        if (this.positionAtCollisionPoint === undefined) {
            this.positionAtCollisionPoint = this.getPosition().clone();
        }
        if (!this.shouldMoveForward()) {
            this.driveBackward();
        } else {
            this.hasCollidedWithWall = false;
        }
    }

    private driveBackward(): void {
        this.isAcceleratorPressed = false;
        this.brake();
        if (this.getPosition().clone().sub(this.positionAtCollisionPoint).length() >= BACKWARD_DISTANCE) {
            this.releaseBrakes();
            this.hasCollidedWithWall = false;
            this.positionAtCollisionPoint = undefined;
        }
    }

    // https://mathoverflow.net/a/44098
    private isCarOnLeftSideOfRoad(): boolean {
        const intersections: Array<Vector2> = this.Information.IntersectionPositions;
        const previousCheckpoint: number = this.Information.NextCheckpoint - 1 < 0 ? this.Information.Checkpoints.length - 1 :
            this.Information.NextCheckpoint - 1;
        const triangle: Matrix3 = new Matrix3().fromArray(
            [1, 1, 1,
             this.getPosition().x, intersections[this.Information.NextCheckpoint].x, intersections[previousCheckpoint].x,
             this.getPosition().z, intersections[this.Information.NextCheckpoint].y, intersections[previousCheckpoint].y]);

        return triangle.determinant() > 0;
    }

    private shouldMoveForward(): boolean {
        const carDirection: Vector2 = new Vector2(this.direction.x, this.direction.z).normalize();
        const perpendicularToTrackDirection: Vector2 = new Vector2(-this.trackDirection().y, this.trackDirection().x);
        const isFacingLeft: boolean = carDirection.dot(perpendicularToTrackDirection.normalize()) >= 0;
        if (this.isCarOnLeftSideOfRoad()) {
            return isFacingLeft;
        } else {
            return !isFacingLeft;
        }
    }

    private trackDirection(): Vector2 {
        const previousCheckpoint: number = (this.Information.NextCheckpoint - 1 < 0) ? this.Information.Checkpoints.length - 1 :
            this.Information.NextCheckpoint - 1;

        return new Vector2().subVectors(this.Information.IntersectionPositions[this.Information.NextCheckpoint],
                                        this.Information.IntersectionPositions[previousCheckpoint]);
    }

    private adjustSpeed(): void {
        if (this.Information.DistanceToNextCheckpoint < this.brakingDistance()) {
            if (this.speed.length() > 0) {
                this.brake();
                this.isAcceleratorPressed = false;
            }
        } else {
            this.releaseBrakes();
            this.isAcceleratorPressed = true;
        }
    }

    private drive(): void {
        this.adjustSpeed();
        this.steer();
    }

    public update(deltaTime: number): void {
        super.update(deltaTime);
        if (!this.isInitialized) {
            return;
        }
        if (this.hasCollidedWithWall) {
            this.collisionRoutine();
        } else {
            this.drive();
        }
    }
}
