import { TopViewCamera } from "./camera-orthogonal";
import { Car } from "../car/car";
import { INITIAL_CAMERA_POSITION_Y, FRUSTUM_RATIO } from "../../constants";
import { Euler } from "three";

const MS_BETWEEN_FRAMES: number = 16.6667;

describe("CameraOrthogonal", () => {
    let camera: TopViewCamera;
    let car: Car = new Car();

    beforeEach(async (done: () => void) => {
        car = new Car();
        await car.init();
        const top: number = 100;
        const bottom: number = 100;
        const left: number = 100;
        const right: number = 100;
        const near: number = 1;
        const far: number = 1000;
        camera = new TopViewCamera(left, right, top, bottom, near, far);
        done();
    });

    it("should be instantiated correctly when passing parameters", () => {
        expect(camera).toBeDefined();
    });

    it("should be centered on the car after initialization", () => {
        camera.init(car.getPosition());
        expect(camera.position.x).toBe(car.getPosition().x);
        expect(camera.position.z).toBe(car.getPosition().z);
        expect(camera.position.y).toBe(INITIAL_CAMERA_POSITION_Y);
    });

    it("should be centered on the car after update", () => {
        car.isAcceleratorPressed = true;
        car.update(MS_BETWEEN_FRAMES);
        car.isAcceleratorPressed = false;
        camera.update(car);
        expect(camera.position.x).toBe(car.getPosition().x);
        expect(camera.position.z).toBe(car.getPosition().z);
        expect(camera.position.y).toBe(INITIAL_CAMERA_POSITION_Y);
    });

    it("should not rotate around itself", () => {
        const initialCameraRotation: Euler = camera.rotation;
        car.isAcceleratorPressed = true;
        car.steerLeft();
        car.update(MS_BETWEEN_FRAMES);
        camera.update(car);
        expect(camera.rotation).toBe(initialCameraRotation);
    });

    it("should adjust the view if the window is resized", () => {
        const width: number = 1000;
        const height: number = 500;
        camera.onResize(width, height);
        expect(camera.right * FRUSTUM_RATIO).toBe(width);
        expect(camera.top * FRUSTUM_RATIO).toBe(height);
        expect(camera.right + camera.left).toBe(0);
        expect(camera.top + camera.bottom).toBe(0);
    });
});
