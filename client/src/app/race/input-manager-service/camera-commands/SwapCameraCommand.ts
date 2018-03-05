import { CameraContext } from "../../camera/camera-context";
import { AbsCameraCommand } from "./AbsCameraCommand";

export class SwapCameraCommand extends AbsCameraCommand {
    public constructor(cameraContext: CameraContext) {
        super(cameraContext);
    }

    public execute(): void {
        this.cameraContext.swapCameraState();
    }
}
