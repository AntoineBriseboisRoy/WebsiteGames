import { Car } from "./car";
import { Vector2, Vector3 } from "three";

const MINIMUM_ANGLE_FOR_STEERING: number = 0.1; 

export class CarAI extends Car {

    public isInitialized: boolean;
    private previousPosition: Vector3;
    public constructor() {
        super();
        this.previousPosition = new Vector3();
        this.isInitialized = false;
    }

    private steer(): void {
        if ( this.angleBetweenTrackAndCarDirection() < MINIMUM_ANGLE_FOR_STEERING) {
            this.releaseSteering();
        } else if ( this.trackDirection().x * this.carDirection().z -  this.trackDirection().y * this.carDirection().x >= 0) {
            this.steerLeft();
        } else {
            this.steerRight();
        }
    }

    private angleBetweenTrackAndCarDirection(): number {
        const carDirection: Vector2 = new Vector2( this.carDirection().x, this.carDirection().z).normalize();
        if (carDirection.length() === 0) {
            return 0;
        }

        return Math.acos(this.trackDirection().dot(carDirection) / (this.trackDirection().length() * carDirection.length()));
    }

    public update(deltaTime: number): void {
        super.update(deltaTime);
        if (!this.isInitialized) {
            return;
        }
        this.isAcceleratorPressed = true;
        this.steer();
        this.previousPosition = this.getPosition().clone();
    }

    private trackDirection(): Vector2 {
        const previousCheckpoint: number = (this.Information.nextCheckpoint - 1 < 0) ? this.Information.Checkpoints.length - 1 :
                                            this.Information.nextCheckpoint - 1;

        return new Vector2().subVectors(this.Information.IntersectionPositions[this.Information.nextCheckpoint],
                                        this.Information.IntersectionPositions[previousCheckpoint]).normalize();
    }

    private carDirection(): Vector3 {
        return new Vector3().subVectors(this.getPosition(), this.previousPosition);
    }
}
