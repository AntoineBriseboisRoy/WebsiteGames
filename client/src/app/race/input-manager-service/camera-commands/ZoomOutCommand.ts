import { AbsCameraCommand } from "./AbsCameraCommand";
import { GameCamera } from "../../camera/game-camera";
import { Car } from "../../car/car";
export class ZoomOutCommand extends AbsCameraCommand {
    public constructor(camera: GameCamera) {
        super(camera);
    }

    public execute(): void {
        console.log("zooming out Command");
        this.camera.zoomOut();
    }
}
