import { TestBed, inject } from "@angular/core/testing";

import {
  InputManagerService, ACCELERATE_KEYCODE, LEFT_KEYCODE,
  BRAKE_KEYCODE, RIGHT_KEYCODE, ZOOM_IN_KEYCODE,
  ZOOM_OUT_KEYCODE, SWAP_CAM_KEYCODE
} from "./input-manager.service";
import {Car} from "../car/car";
import { CameraContext } from "../camera/camera-context";
import {Vector3} from "three";

const car: Car = new Car();
const MS_BETWEEN_FRAMES: number = 16.6667;
const cameraContext: CameraContext = new CameraContext();
const service: InputManagerService = new InputManagerService();
const INVALID_KEYCODE: number = 123;

describe("InputManagerService", () => {
  service.init(car, cameraContext);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InputManagerService]
    });
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should accelerate the car", () => {
    service.handleKeyDown(ACCELERATE_KEYCODE);
    expect(car.isAcceleratorPressed).toEqual(true);
  });
  it("should stop accelerating the car", () => {
    service.handleKeyUp(ACCELERATE_KEYCODE);
    expect(car.isAcceleratorPressed).toEqual(false);
  });
});
