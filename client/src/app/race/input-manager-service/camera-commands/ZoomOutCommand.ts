import { AbsCameraCommand } from "./AbsCameraCommand";
import { Car } from "../../car/car";
import { ThirdPersonCamera } from "../../camera/camera-perspective";
import { CameraContext } from "../../camera/camera-context";
export class ZoomOutCommand extends AbsCameraCommand {
    public constructor(cameraContext: CameraContext) {
        super(cameraContext);
    }

    public execute(): void {
        this.cameraContext.zoomOut();
    }
}
