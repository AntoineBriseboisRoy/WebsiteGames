import { Car } from "./car";
import { Vector2, Vector3 } from "three";
import { PI_OVER_2 } from "../../constants";

export class CarAI extends Car {

    private previousPosition: Vector3;
    public constructor() {
        super();
        this.previousPosition = new Vector3();
    }

    private steer(): void {
        const angle: number = this.calculateAngle();

        const previousCheckpoint: number = (this.Information.nextCheckpoint - 1 < 0) ? this.Information.Checkpoints.length - 1 :
        this.Information.nextCheckpoint - 1;
        const trackDirection: Vector2 =
        new Vector2().subVectors(this.Information.IntersectionPositions[this.Information.nextCheckpoint],
                                 this.Information.IntersectionPositions[previousCheckpoint]).normalize();
        const carDirection: Vector2 = new Vector2( this.calculateDirection().x, this.calculateDirection().z).normalize();

        // const perpendicularToTrackDirection: Vector2 = new Vector2(-trackDirection.y, trackDirection.x);
        // const vector: Vector2 = new Vector2(Math.tan(angle) * trackDirection.x, Math.tan(angle) * trackDirection.y);

        if (angle > -0.1 && angle < 0.1) {
            this.releaseSteering();
        } else if (trackDirection.x * carDirection.y - trackDirection.y * carDirection.x >= 0) {
            this.steerLeft();
        } else {
            this.steerRight();
        }
    }

    private calculateAngle(): number {
        const previousCheckpoint: number = (this.Information.nextCheckpoint - 1 < 0) ? this.Information.Checkpoints.length - 1 :
                                                                                 this.Information.nextCheckpoint - 1;
        const trackDirection: Vector2 =
                            new Vector2().subVectors(this.Information.IntersectionPositions[this.Information.nextCheckpoint],
                                                     this.Information.IntersectionPositions[previousCheckpoint]).normalize();

        const carDirection: Vector2 = new Vector2( this.calculateDirection().x, this.calculateDirection().z).normalize();
        if (carDirection.length() === 0) {
            return 0;
        }

        return Math.acos(trackDirection.dot(carDirection) /
            (trackDirection.length() * carDirection.length()));
    }

    public update(deltaTime: number): void {
        super.update(deltaTime);
        this.isAcceleratorPressed = true;
        console.log(this.calculateAngle());
        this.steer();
        this.previousPosition = this.getPosition().clone();
        //console.log("----------------------");
        //console.log("PROCHAIN CHECKPOINT: " + this.Information.nextCheckpoint +  "\nLeft: " + this.Information.Checkpoints[this.Information.nextCheckpoint][0].toArray() +
        //            "\nRight: " + this.Information.Checkpoints[this.Information.nextCheckpoint][1].toArray());
        //console.log("----------------------");

    }

    private calculateDirection(): Vector3 {
        return new Vector3().subVectors(this.getPosition(), this.previousPosition);
    }
}
