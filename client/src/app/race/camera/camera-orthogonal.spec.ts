import { TopViewCamera } from "./camera-orthogonal";
import { Car } from "../car/car";
import { INITIAL_CAMERA_POSITION_Y, FRUSTUM_RATIO } from "../../constants";
import { Euler } from "three";

const MS_BETWEEN_FRAMES: number = 16.6667;

const ZOOM_INCREMENT: number = 0.05;
const INITIAL_ZOOM_FACTOR: number = 1;
const MAX_ZOOM: number = 3;
const MIN_ZOOM: number = 0.5;
const ITERATION_NUMBER: number =  5;

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
    it("should zoomOut at a constant rate", () => {
        for (let i: number = 0; i < ITERATION_NUMBER; i++) {
            camera.zoomOut();
        }
        const totalZoom: number = ITERATION_NUMBER * ZOOM_INCREMENT;
        expect(camera.zoom).toEqual( INITIAL_ZOOM_FACTOR - totalZoom);
    });
    it("should zoomIn at a constant rate", () => {
        for (let i: number = 0; i < ITERATION_NUMBER; i++) {
            camera.zoomIn();
        }
        const totalZoom: number = ITERATION_NUMBER * ZOOM_INCREMENT;
        expect(camera.zoom).toEqual(totalZoom + INITIAL_ZOOM_FACTOR);
    });
    it("should not exceed the maximum zoom factor", () => {
        for (let i: number = 0; i < ITERATION_NUMBER * 10; i++) {
            camera.zoomIn();
        }
        expect(camera.zoom).toEqual(MAX_ZOOM);
    });
    it("should not exceed the maximum zoom factor", () => {
        for (let i: number = 0; i < ITERATION_NUMBER * 30; i++) {
            camera.zoomOut();
        }
        expect(camera.zoom).toEqual(MIN_ZOOM);
    });

});
