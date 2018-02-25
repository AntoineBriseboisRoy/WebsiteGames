import { ThirdPersonCamera } from "./camera-perspective";
import { FIELD_OF_VIEW, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE } from "../render-service/render.service";
import { Car } from "../car/car";
import { Vector3 } from "three";

const MS_BETWEEN_FRAMES: number = 16.6667;

const ZOOM_INCREMENT: number = 0.05;
const INITIAL_ZOOM_FACTOR: number = 1;
const MAX_ZOOM: number = 2.5;
const MIN_ZOOM: number = 0.7;
const ITERATION_NUMBER: number =  5;

describe("CameraPerspective", () => {
    let camera: ThirdPersonCamera;
    let car: Car;

    beforeEach(async (done: () => void) => {
        car = new Car();
        await car.init();
        const width: number = 100;
        const height: number = 100;
        camera = new ThirdPersonCamera(FIELD_OF_VIEW,
                                       NEAR_CLIPPING_PLANE,
                                       FAR_CLIPPING_PLANE,
                                       width, height);
        camera.init(car.getPosition());
        done();
    });

    it("should be instantiated correctly when passing parameters", () => {
        expect(camera).toBeDefined();
    });

    it("should be behind the car", () => {
        expect(Math.abs(car.getPosition().z - camera.position.z)).toBeGreaterThan(0);
    });

    it("should look down", () => {
        expect(camera.rotation.x).toBeLessThan(0);
    });

    it("should be on a rigid stick", () => {
        const initialPositionCamera: Vector3 = camera.position;
        const initialPositionCar: Vector3 = car.getPosition();
        car.isAcceleratorPressed = true;
        car.update(MS_BETWEEN_FRAMES);
        car.isAcceleratorPressed = false;
        camera.update(car);
        expect(initialPositionCamera.x - initialPositionCar.x).toBe(camera.position.x - car.getPosition().x);
        expect(initialPositionCamera.y - initialPositionCar.y).toBe(camera.position.y - car.getPosition().y);
        expect(initialPositionCamera.z - initialPositionCar.z).toBe(camera.position.z - car.getPosition().z);
    });

    /* tslint:disable: no-magic-numbers */
    it("should be on a rigid stick when turning", () => {
        const initialPositionCamera: Vector3 = camera.position;
        const initialPositionCar: Vector3 = car.getPosition();
        const initialModule: number = Math.round(Math.sqrt(Math.pow(initialPositionCamera.x - initialPositionCar.x, 2)
                                                + Math.pow(initialPositionCamera.y - initialPositionCar.y, 2)
                                                + Math.pow(initialPositionCamera.z - initialPositionCar.z, 2)) * 100) / 100;
        car.isAcceleratorPressed = true;
        car.steerLeft();
        car.update(MS_BETWEEN_FRAMES);
        camera.update(car);
        const finalModule: number = Math.round(Math.sqrt(Math.pow(camera.position.x - car.getPosition().x, 2)
                                                + Math.pow(camera.position.y - car.getPosition().y, 2)
                                                + Math.pow(camera.position.z - car.getPosition().z, 2)) * 100) / 100;
        expect(initialModule).toBe(finalModule);
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
        for (let i: number = 0; i < ITERATION_NUMBER * 20; i++) {
            camera.zoomOut();
        }
        expect(camera.zoom).toEqual(MIN_ZOOM);
    });
});
