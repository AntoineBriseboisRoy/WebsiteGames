import { Injectable } from "@angular/core";
import { Vector2, ObjectLoader, Object3D, PlaneBufferGeometry, MeshBasicMaterial, Mesh, DoubleSide, TextureLoader } from "three";
import { Car } from "./car/car";
import { ITrack, TrackType } from "../../../../common/interfaces/ITrack";
import { HALF, PI_OVER_2, ROAD_WIDTH } from "../constants";
import { Point } from "./edit-track/Geometry";

export const FAR_CLIPPING_PLANE: number = 1000;
export const NEAR_CLIPPING_PLANE: number = 1;
export const FIELD_OF_VIEW: number = 70;

const WORLD_SIZE: number = 1000;
const QUARTER_ROAD_WIDTH: number = 2.5;
const CAR_OFFSET_FROM_STARTLINE: number = 0.01;
const SUPERPOSITION: number = 0.01;
const STARTLINE_HEIGHT: number = 2;
const DOUBLE: number = 2;

@Injectable()
export class StartLineGeneratorService {
    private activeTrack: ITrack;
    private cars: Array<Car>;
    private firstRoad: Vector2;
    public constructor() {
        this.activeTrack = {
            _id: "",
            name: "",
            description: "",
            nTimesPlayed: 0,
            bestTimes: Array<string>(),
            type: TrackType.REGULAR,
            points: Array<Point>()
        } as ITrack;
        this.cars = new Array<Car>();
        this.firstRoad = new Vector2();
    }

    public async generateStartLine(firstRoad: Vector2, cars: Array<Car>, activeTrack: ITrack): Promise<Object3D> {
        this.activeTrack = activeTrack;
        this.cars = cars;
        this.firstRoad = firstRoad;

        return this.loadStartLineBanner().then((startLineBanner: Object3D) => {
            this.setStartLineBannerPosition(startLineBanner);
            this.placeCarsBehindStartLine(startLineBanner);
            this.placeCarsInRow();

            return startLineBanner;
        });
    }

    public createGroundStartLine(startLineBanner: Object3D): Mesh {
        const startLine: Mesh = new Mesh(new PlaneBufferGeometry(ROAD_WIDTH, STARTLINE_HEIGHT),
                                         new MeshBasicMaterial({ map: new TextureLoader().load("../assets/checkerboard.jpg"),
                                                                 side: DoubleSide}));
        startLine.position.x = startLineBanner.position.x;
        startLine.position.y = startLineBanner.position.y + SUPERPOSITION;
        startLine.position.z = startLineBanner.position.z;
        startLine.rotation.y = startLineBanner.rotation.y;
        startLine.rotateX(PI_OVER_2);

        return startLine;
    }

    private async loadStartLineBanner(): Promise<Object3D> {
        return new Promise<Object3D>((resolve) => new ObjectLoader().load("../../assets/startLineBanner.json", resolve));
    }

    private setStartLineBannerPosition(startLineBanner: Object3D): void {
        startLineBanner.scale.setX(startLineBanner.scale.x * DOUBLE);
        startLineBanner.position.x = -(this.activeTrack.points[0].y + this.firstRoad.y * HALF) * WORLD_SIZE + WORLD_SIZE * HALF;
        startLineBanner.position.z = -(this.activeTrack.points[0].x + this.firstRoad.x * HALF) * WORLD_SIZE + WORLD_SIZE * HALF;
        startLineBanner.rotation.y = Math.atan(this.firstRoad.y / this.firstRoad.x);
    }

    private placeCarsBehindStartLine(startLineBanner: Object3D): void {
        for (const car of this.cars) {
            car.getPosition().x = startLineBanner.position.x + (CAR_OFFSET_FROM_STARTLINE * WORLD_SIZE) * this.firstRoad.y /
                this.firstRoad.length();
            car.getPosition().z = startLineBanner.position.z + (CAR_OFFSET_FROM_STARTLINE * WORLD_SIZE) * this.firstRoad.x /
                this.firstRoad.length();
            car.getRotation().y = this.firstRoad.x > 0 ? startLineBanner.rotation.y : startLineBanner.rotation.y + Math.PI;
        }
    }

    private placeCarsInRow(): void {
        const EVEN: number = 2;
        let row: number = 0;
        let column: number = 0;
        const shuffledCars: Array<Car> = this.cars.slice();
        this.shuffleCars(shuffledCars);
        const perpendicularDirection: Vector2 = new Vector2(-this.firstRoad.y, this.firstRoad.x);
        for (let i: number = 0; i < shuffledCars.length; i++) {
            column = i % EVEN;
            this.setCarInitialPosition(shuffledCars[i], row, column, perpendicularDirection);
            if (column === 1) {
                row++;
            }
        }
    }

    private setCarInitialPosition(car: Car, row: number, column: number, perpendicularDirection: Vector2): void {
        const CAR_OFFSET_FROM_EACH_OTHER: number = 5;
        car.getPosition().x += (row * CAR_OFFSET_FROM_EACH_OTHER - QUARTER_ROAD_WIDTH)
                                * this.firstRoad.y / this.firstRoad.length();
        car.getPosition().z += (row * CAR_OFFSET_FROM_EACH_OTHER - QUARTER_ROAD_WIDTH)
                                * this.firstRoad.x / this.firstRoad.length();
        car.getPosition().x += Math.pow(-1, column) * CAR_OFFSET_FROM_EACH_OTHER * perpendicularDirection.y /
                                                                                   perpendicularDirection.length();
        car.getPosition().z += Math.pow(-1, column) * CAR_OFFSET_FROM_EACH_OTHER * perpendicularDirection.x /
                                                                                   perpendicularDirection.length();
    }

    // Fisher-Yates Algorithm
    private shuffleCars(cars: Array<Car>): void {
        let currentIndex: number = cars.length;
        let temporaryValue: Car;
        let randomIndex: number;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = cars[currentIndex];
            cars[currentIndex] = cars[randomIndex];
            cars[randomIndex] = temporaryValue;
        }
    }
}
