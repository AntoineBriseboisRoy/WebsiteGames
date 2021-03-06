import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import { WebGLRenderer, Scene, AmbientLight, Mesh, PlaneBufferGeometry, Vector2,
         BackSide, Texture, RepeatWrapping, TextureLoader, Object3D, MeshPhongMaterial } from "three";
import { Car } from "../car/car";
import { ThirdPersonCamera } from "../camera/camera-perspective";
import { TopViewCamera } from "../camera/camera-orthogonal";
import { INITIAL_CAMERA_POSITION_Y, FRUSTUM_RATIO, PI_OVER_2, HALF } from "../../constants";
import { Skybox, DayPeriod } from "../skybox/skybox";
import { CameraContext } from "../camera/camera-context";
import { ITrack, TrackType } from "../../../../../common/interfaces/ITrack";
import { CollisionManager } from "../car/collision-manager.service";
import { RoadCreator } from "./road-creator.service";
import { StartLineGeneratorService } from "../start-line-generator.service";
import { DayPeriodContext } from "../dayToggle-context";
import { SoundManagerService } from "../sound-manager.service";
import { CarAI } from "../car/car-ai";

export const FAR_CLIPPING_PLANE: number = 1000;
export const NEAR_CLIPPING_PLANE: number = 1;
export const FIELD_OF_VIEW: number = 70;

const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_DAY: number = 1;
const AMBIENT_LIGHT_NIGHT: number = 0.5;
const TEXTURE_TILE_REPETIONS: number = 200;
const WORLD_SIZE: number = 1000;
const FLOOR_SIZE: number = WORLD_SIZE / HALF;
const PLAYER: number = 0;
const NUMBER_OF_CARS: number = 4;
const BASE_RPM: number = 3500;

@Injectable()
export class RenderService {
    private isInitialized: boolean;
    private cameraContext: CameraContext;
    private dayPeriodContext: DayPeriodContext;
    private container: HTMLDivElement;
    private cars: Array<Car>;
    private renderer: WebGLRenderer;
    private scene: THREE.Scene;
    private stats: Stats;
    private lastDate: number;
    private activeTrack: ITrack;
    private floorTextures: Map<TrackType, Texture>;
    public get Cars(): Array<Car> {
        return this.cars;
    }

    public get CameraContext(): CameraContext {
        return this.cameraContext;
    }

    public get DayPeriodContext(): DayPeriodContext {
        return this.dayPeriodContext;
    }

    public get FloorTextures(): Map<TrackType, Texture> {
        return this.floorTextures;
    }

    public get ActiveTrack(): ITrack {
        return this.activeTrack;
    }

    public constructor(private collisionManager: CollisionManager, private roadCreator: RoadCreator,
                       private startLineGeneratorService: StartLineGeneratorService, private soundManager: SoundManagerService) {
        this.isInitialized = false;
        this.cameraContext = new CameraContext();
        this.dayPeriodContext = new DayPeriodContext(this);
        this.createCars();
        this.renderer = new WebGLRenderer();
        this.stats = new Stats();
        this.lastDate = 0;
        this.activeTrack = {} as ITrack;
        this.floorTextures = new Map<TrackType, Texture>();
        this.scene = new Scene();
    }

    public get IsInitialized(): boolean {
        return this.isInitialized;
    }

    public async initialize(container: HTMLDivElement, track: ITrack): Promise<void> {
        if (container) {
            this.container = container;
        }
        this.activeTrack = track;
        this.initFloorTextures();

        await this.createScene();
        this.initStats();
        this.isInitialized = true;
        this.startRenderingLoop();
    }

    public initializeAI(): void {
        for (const car of this.cars) {
            (car as CarAI).isInitialized = true;
        }
    }

    public onResize(): void {
        this.cameraContext.onResize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
    private createCars(): void {
        this.cars = new Array<Car>();
        this.cars.push(new Car());
        for (let i: number = 1; i < NUMBER_OF_CARS; i++) {
            this.cars.push(new CarAI());
        }
    }

    private initStats(): void {
        this.stats.dom.style.position = "absolute";
        this.container.appendChild(this.stats.dom);
    }

    private initFloorTextures(): void {
        const textureLoader: TextureLoader = new TextureLoader();
        this.floorTextures.set(TrackType.REGULAR, textureLoader.load("/assets/grass.jpg"));
    }

    private update(): void {
        const timeSinceLastFrame: number = Date.now() - this.lastDate;
        this.cars.forEach((car: Car) => car.update(timeSinceLastFrame));
        this.soundManager.changeCarSoundSpeed(this.cars[PLAYER].rpm / BASE_RPM);
        this.cameraContext.update(this.cars[PLAYER]);
        this.lastDate = Date.now();
        this.collisionManager.update();
        this.cars.forEach((car) => {
            car.Information.updateDistanceToNextCheckpoint(new Vector2(car.getPosition().x, car.getPosition().z));
        });
    }

    private async createScene(): Promise<void> {
        this.cameraContext.addState(new ThirdPersonCamera(FIELD_OF_VIEW,
                                                          NEAR_CLIPPING_PLANE,
                                                          FAR_CLIPPING_PLANE,
                                                          this.container.clientWidth,
                                                          this.container.clientHeight));

        this.cameraContext.addState(new TopViewCamera(-this.container.clientWidth / FRUSTUM_RATIO,
                                                      this.container.clientWidth / FRUSTUM_RATIO,
                                                      this.container.clientHeight / FRUSTUM_RATIO,
                                                      -this.container.clientHeight / FRUSTUM_RATIO,
                                                      1, INITIAL_CAMERA_POSITION_Y + 1)); // Add 1 to see the floor

        await this.initializeCars();

        this.cameraContext.initStates(this.cars[PLAYER].getPosition());
        this.cameraContext.setInitialState();

        this.createSkyboxes();
        this.scene.add(this.dayPeriodContext.CurrentState["1"]);
        this.scene.background = this.dayPeriodContext.CurrentState["0"].SkyboxCube;
        this.createFloorMesh();
        this.generateTrack();
    }

    private createSkyboxes(): void {
        this.dayPeriodContext.addState([new Skybox(DayPeriod.DAY), new AmbientLight(WHITE, AMBIENT_LIGHT_DAY)]);
        this.dayPeriodContext.addState([new Skybox(DayPeriod.NIGHT), new AmbientLight(WHITE, AMBIENT_LIGHT_NIGHT)]);
        this.dayPeriodContext.setInitialState();
    }

    public removeLight(): void {
        this.scene.remove(this.dayPeriodContext.CurrentState["1"]);
    }
    public toggleDayNight(): void {
        this.scene.add(this.dayPeriodContext.CurrentState["1"]);
        this.scene.background = this.dayPeriodContext.CurrentState["0"].SkyboxCube;
    }

    private async initializeCars(): Promise<void> {
        for (const car of this.cars) {
            await car.init();
            this.collisionManager.addCar(car);
            this.scene.add(car);
        }
    }

    private generateTrack(): void {
        this.roadCreator.createTrack(this.activeTrack.points);
        this.addTrack();
        this.addCheckpoints();
        this.createStartLine();
    }

    private addTrack(): void {
        this.roadCreator.Meshes.forEach((mesh: Mesh) => {
            this.scene.add(mesh);
            this.collisionManager.addRoadSegment(mesh);
            if ( mesh.name === "Intersection" ) {
                for (const car of this.cars) {
                    car.Information.addIntersectionPosition(new Vector2(mesh.position.x, mesh.position.z));
                }
            }
        });
    }

    private addCheckpoints(): void {
        const checkpoints: Array<[Vector2, Vector2]> = new Array<[Vector2, Vector2]>();
        this.roadCreator.CheckpointMeshes.forEach((mesh, index) => {
            this.collisionManager.addCheckpoint(mesh);
            this.pushCheckpoint(index, checkpoints);
            this.scene.add(mesh);
        });
        this.cars.forEach((car: Car) => {
            car.Information.Checkpoints = checkpoints;
        });
    }

    private pushCheckpoint(index: number, checkpoints: Array<[Vector2, Vector2]>): void {
        if (index - 1 < 0) {
            checkpoints.push(this.roadCreator.CheckpointsSegments[this.roadCreator.CheckpointMeshes.length - 1]);
        } else {
            checkpoints.push(this.roadCreator.CheckpointsSegments[index - 1]);
        }
    }

    private createStartLine(): void {
        this.startLineGeneratorService.generateStartLine(new Vector2(this.activeTrack.points[1].x - this.activeTrack.points[0].x,
                                                                     this.activeTrack.points[1].y - this.activeTrack.points[0].y),
                                                         this.cars, this.activeTrack)
        .then((startLine: Object3D) => {
            const groundStartLine: Mesh = this.startLineGeneratorService.createGroundStartLine(startLine);
            this.scene.add(startLine, groundStartLine);
            this.collisionManager.setStartLine(groundStartLine);
            for (const car of this.cars) {
                this.soundManager.init(car);
            }
        })
        .catch((error: Error) => console.error(error));
    }

    private createFloorMesh(): void {
        this.floorTextures.get(this.activeTrack.type).wrapS = this.floorTextures.get(this.activeTrack.type).wrapT = RepeatWrapping;
        this.floorTextures.get(this.activeTrack.type).repeat.set(TEXTURE_TILE_REPETIONS, TEXTURE_TILE_REPETIONS);
        const mesh: Mesh = new Mesh(new PlaneBufferGeometry(FLOOR_SIZE, FLOOR_SIZE, 1, 1),
                                    new MeshPhongMaterial({ map: this.floorTextures.get(this.activeTrack.type), side: BackSide }));
        mesh.rotation.x = PI_OVER_2;

        this.scene.add(mesh);
    }

    private startRenderingLoop(): void {
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

        this.lastDate = Date.now();
        this.container.appendChild(this.renderer.domElement);
        this.render();
    }

    private render(): void {
        requestAnimationFrame(() => this.render());
        this.update();
        this.renderer.render(this.scene, this.cameraContext.CurrentState);
        this.stats.update();
    }
}
