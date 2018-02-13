import { AbsCameraCommand } from "./AbsCameraCommand";
import { GameCamera } from "../../camera/game-camera";
import {Car} from "../../car/car";
import { ThirdPersonCamera } from "../../camera/camera-perspective";

export class ZoomInCommand extends AbsCameraCommand {
    public constructor(camera: GameCamera) {
        super(camera);
    }

    public execute(): void {
        this.camera.zoomIn();
    }
}
