import { AbsCameraCommand } from "./AbsCameraCommand";
import { Camera } from "three";
import { GameCamera } from "../../camera/game-camera";

export class ZoomOutCommand extends AbsCameraCommand {
    public constructor(camera: GameCamera) {
        super(camera);
    }

    public execute(): void {
        this.camera.zoomOut();
    }
}
