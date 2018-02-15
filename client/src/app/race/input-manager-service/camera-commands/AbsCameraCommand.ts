import { AbsCommand } from "../AbsCommand";
import { Car } from "../../car/car";
import { Camera } from "three";
import { ThirdPersonCamera } from "../../camera/camera-perspective";
import { CameraContext } from "../../camera/camera-context";

export abstract class AbsCameraCommand extends AbsCommand {
    public constructor(protected cameraContext: CameraContext) {
        super();
     }

    public abstract execute(): void;
}
