import { AbsCameraCommand } from "./AbsCameraCommand";
import { GameCamera } from "../../camera/game-camera";

export class ZoomInCommand extends AbsCameraCommand {
    public constructor(camera: GameCamera) {
        super(camera);
    }

    public execute(): void {
        this.camera.zoomOut();
    }
}
