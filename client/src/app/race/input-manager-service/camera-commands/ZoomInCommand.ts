import { AbsCameraCommand } from "./AbsCameraCommand";
import { GameCamera } from "../../camera/game-camera";
import {Car} from "../../car/car";

export class ZoomInCommand extends AbsCameraCommand {
    public constructor(camera: GameCamera) {
        super(camera);
    }

    public execute(): void {
        console.log("zooming in Command");
        this.camera.zoomIn();
    }
}
