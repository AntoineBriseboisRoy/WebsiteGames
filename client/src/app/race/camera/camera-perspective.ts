import { PerspectiveCamera, Vector3 } from "three";
import { Car } from "../car/car";
import { INITIAL_CAMERA_POSITION_Y } from "../../constants";

const RELATIVE_CAMERA_OFFSET_X: number = 0;
const RELATIVE_CAMERA_OFFSET_Y: number = 2;
const RELATIVE_CAMERA_OFFSET_Z: number = 5;

export class ThirdPersonCamera extends PerspectiveCamera {

    private static getAspectRatio(clientWidth: number, clientHeight: number): number {
      return clientWidth / clientHeight;
    }

    public constructor(fieldOfView: number, nearClippingPlane: number, farClippingPlane: number,
                       clientWidth: number, clientHeight: number) {
        super(fieldOfView, ThirdPersonCamera.getAspectRatio(clientWidth, clientHeight),
              nearClippingPlane, farClippingPlane);
    }

    public init(lookAt: Vector3): void {
      this.position.set(0, INITIAL_CAMERA_POSITION_Y, 0);
      this.lookAt(lookAt);
    }

    public update(_car: Car): void {
      const RELATIVE_CAMERA_OFFSET: Vector3 = new Vector3(RELATIVE_CAMERA_OFFSET_X,
                                                          RELATIVE_CAMERA_OFFSET_Y,
                                                          RELATIVE_CAMERA_OFFSET_Z);
      const absoluteCarPosition: Vector3 = RELATIVE_CAMERA_OFFSET.applyMatrix4(_car.getWorldMatrix());
      this.position.x = absoluteCarPosition.x;
      this.position.z = absoluteCarPosition.z;
      this.position.y = absoluteCarPosition.y;

      this.lookAt(_car.getPosition());
    }

    public onResize(clientWidth: number, clientHeight: number): void {
      this.aspect = ThirdPersonCamera.getAspectRatio(clientWidth, clientHeight);
      this.updateProjectionMatrix();
    }
}
