import { AbsCommand } from "../AbsCommand";
import { CameraContext } from "../../camera/camera-context";

export abstract class AbsCameraCommand extends AbsCommand {
    public constructor(protected cameraContext: CameraContext) {
        super();
     }

    public abstract execute(): void;
}
