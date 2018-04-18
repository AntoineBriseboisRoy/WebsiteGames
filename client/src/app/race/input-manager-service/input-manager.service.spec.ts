import { TestBed } from "@angular/core/testing";
import {
  InputManagerService, ACCELERATE_KEYCODE, LEFT_KEYCODE,
  BRAKE_KEYCODE, RIGHT_KEYCODE, ZOOM_IN_KEYCODE,
  ZOOM_OUT_KEYCODE, SWAP_CAM_KEYCODE
} from "./input-manager.service";
import {Car} from "../car/car";
import { CameraContext } from "../camera/camera-context";
import { DayPeriodContext } from "../dayToggle-context";
import { RenderService } from "../render-service/render.service";

const car: Car = new Car();
const cameraContext: CameraContext = new CameraContext();
const service: InputManagerService = new InputManagerService();
let dayPeriodContext: DayPeriodContext;

describe("InputManagerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InputManagerService, RenderService]
    });
    dayPeriodContext = new DayPeriodContext(TestBed.get(RenderService));
    service.init(car, cameraContext, dayPeriodContext);
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
  it("should call the brake method of Car", () => {
    spyOn(car, "brake");
    service.handleKeyDown(BRAKE_KEYCODE);
    expect(car.brake).toHaveBeenCalled();
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
