import { AbsCommand } from "../AbsCommand";
import { Car } from "../../car/car";
import { GameCamera } from "../../camera/game-camera";
import { Camera } from "three";

export abstract class AbsCameraCommand extends AbsCommand {
    public constructor(protected camera: GameCamera) {
        super();
     }

    public abstract execute(): void;
}
