import { OrthographicCamera, Vector3 } from "three";
import { Car } from "../car/car";
import { INITIAL_CAMERA_POSITION_Y, FRUSTUM_RATIO } from "../../constants";
import { GameCamera } from "./game-camera";

const ZOOM_FACTOR: number = 1;

export class TopViewCamera extends OrthographicCamera implements GameCamera {

    public constructor(left: number, right: number, top: number,
                       bottom: number, near: number, far: number) {
        super(left, right, top, bottom, near, far);
    }

    public init(lookAt: Vector3): void {
        this.position.set(0, INITIAL_CAMERA_POSITION_Y, 0);
        this.lookAt(lookAt);
    }

    public update(_car: Car): void {
        this.position.set(_car.getPosition().x, INITIAL_CAMERA_POSITION_Y, _car.getPosition().z);
        this.lookAt(_car.getPosition());
    }

    public onResize(clientWidth: number, clientHeight: number): void {
        this.left = -clientWidth / FRUSTUM_RATIO;
        this.right = clientWidth / FRUSTUM_RATIO;
        this.top = clientHeight / FRUSTUM_RATIO;
        this.bottom = -clientHeight / FRUSTUM_RATIO;
        this.updateProjectionMatrix();
    }

    public zoomIn(): void {
      //  throw new Error("Method not implemented.");
     this.zoom += ZOOM_FACTOR;
    }

    public zoomOut(): void {
       // throw new Error("Method not implemented.");
       this.zoom -= ZOOM_FACTOR;
    }
}
