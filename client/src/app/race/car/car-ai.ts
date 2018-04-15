import { Car } from "./car";
import { Vector2 } from "three";

export class CarAI extends Car {
    public constructor() {
        super();
    }

    private steer(): void {
        this.steerRight();
    }

    private calculateAngle(): number {
        const nextCheckpointDirection: Vector2 = new Vector2(this.Information.Checkpoints[this.Information.nextCheckpoint][0].x -
                                                             this.Information.Checkpoints[(this.Information.nextCheckpoint + 1) %
                                                                                           this.Information.Checkpoints.length][0].x,
                                                             this.Information.Checkpoints[this.Information.nextCheckpoint][0].y -
                                                             this.Information.Checkpoints[(this.Information.nextCheckpoint + 1) %
                                                                                           this.Information.Checkpoints.length][0].y );
        const carDirection: Vector2 = new Vector2 (this.getPosition().y - this.Information.Checkpoints[this.Information.nextCheckpoint][0].y,
                                                   this.getPosition().x - this.Information.Checkpoints[this.Information.nextCheckpoint][0].x)
                                                   .normalize();

        return Math.acos(nextCheckpointDirection.dot(carDirection) /
            (nextCheckpointDirection.length() * carDirection.length()));
    }

    public update(deltaTime: number): void {
        super.update(deltaTime);
        this.isAcceleratorPressed = true;
        console.log(this.calculateAngle());
        if (this.calculateAngle() < 0.2 || this.calculateAngle() > 0.4 ) {
            this.steer();
        } else {
            this.releaseSteering();
        }
    }

}
