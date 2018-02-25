import { TestBed, inject } from "@angular/core/testing";
import {
  InputManagerService, ACCELERATE_KEYCODE, LEFT_KEYCODE,
  BRAKE_KEYCODE, RIGHT_KEYCODE, ZOOM_IN_KEYCODE,
  ZOOM_OUT_KEYCODE, SWAP_CAM_KEYCODE
} from "./input-manager.service";
import {Car} from "../car/car";
import { CameraContext } from "../camera/camera-context";
import {Vector3} from "three";
import { CameraState } from "../camera/camera-state";
import { ThirdPersonCamera } from "../camera/camera-perspective";

const car: Car = new Car();
const MS_BETWEEN_FRAMES: number = 16.6667;
const cameraContext: CameraContext = new CameraContext();
const service: InputManagerService = new InputManagerService();
const INVALID_KEYCODE: number = 123;
const ARBITRARY_VECTOR: Vector3 = new Vector3(1, 1, 1);

describe("InputManagerService", () => {
  service.init(car, cameraContext);
  beforeEach(() => {
    cameraContext.initStates(ARBITRARY_VECTOR);
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
  it("should call the steerLeft method of Car", () => {
    spyOn(car, "steerLeft");
    service.handleKeyDown(LEFT_KEYCODE);
    expect(car.steerLeft).toHaveBeenCalled();
  });
  it("should call the steerRight method of Car", () => {
    spyOn(car, "steerRight");
    service.handleKeyDown(RIGHT_KEYCODE);
    expect(car.steerRight).toHaveBeenCalled();
  });
  it("should swap the camera view from the current one", () => {
    const currentCameraView: CameraState = new ThirdPersonCamera(0, 0, 0, 0, 0);
    spyOn(cameraContext, "swapCameraState");
    service.handleKeyDown(SWAP_CAM_KEYCODE);
    expect(cameraContext.swapCameraState).toHaveBeenCalled();
  });
  it("should call the ZoomIn method of CameraState", () => {
    spyOn(cameraContext, "zoomIn");
    service.handleKeyDown(ZOOM_IN_KEYCODE);
    expect(cameraContext.zoomIn).toHaveBeenCalled();
  });
  it("should call the ZoomOut method of CameraState", () => {
    spyOn(cameraContext, "zoomOut");
    service.handleKeyDown(ZOOM_OUT_KEYCODE);
    expect(cameraContext.zoomOut).toHaveBeenCalled();
  });
});
