import { AbsCameraCommand } from "./AbsCameraCommand";
import { CameraContext } from "../../camera/camera-context";

export class ZoomInCommand extends AbsCameraCommand {
    public constructor(cameraContext: CameraContext) {
        super(cameraContext);
    }

    public execute(): void {
        this.cameraContext.zoomIn();
    }
}
