import { OrthographicCamera } from "three";
import { Car } from "../car/car";
import {INITIAL_CAMERA_POSITION_Y} from "../../constants";

export class OrthoganalCamera extends OrthographicCamera {
    public constructor(left: number, right: number, top: number,
                       bottom: number, near: number, far: number) {
        super(left, right, top, bottom, near, far);
    }

    public update(_car: Car): void {
      this.position.set(_car.getPosition().x, INITIAL_CAMERA_POSITION_Y, _car.getPosition().z);
      this.lookAt(_car.getPosition());
    }
}
