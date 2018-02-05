import { PerspectiveCamera, Vector3 } from "three";
import { Car } from "../car/car";

const RELATIVE_CAMERA_OFFSET_X: number = 0;
const RELATIVE_CAMERA_OFFSET_Y: number = 2;
const RELATIVE_CAMERA_OFFSET_Z: number = 5;
export class ThirdPersonCamera extends PerspectiveCamera {
    public constructor(fieldOfView: number, aspectRatio: number,
                       nearClippingPlane: number, farClippingPlane: number) {
        super(fieldOfView, aspectRatio, nearClippingPlane, farClippingPlane);
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
}
