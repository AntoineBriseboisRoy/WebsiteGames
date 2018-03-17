import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import { WebGLRenderer, Scene, AmbientLight,
         Mesh, PlaneBufferGeometry, MeshBasicMaterial,
         DoubleSide, Texture, RepeatWrapping, TextureLoader, Vector3 } from "three";
import { Car } from "../car/car";
import { ThirdPersonCamera } from "../camera/camera-perspective";
import { TopViewCamera } from "../camera/camera-orthogonal";
import { INITIAL_CAMERA_POSITION_Y, FRUSTUM_RATIO, PI_OVER_2 } from "../../constants";
import { Skybox } from "../skybox/skybox";
import { CameraContext } from "../camera/camera-context";
import { CollisionManager } from "../car/collision-manager";

export const FAR_CLIPPING_PLANE: number = 1000;
export const NEAR_CLIPPING_PLANE: number = 1;
export const FIELD_OF_VIEW: number = 70;

const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.5;
const TEXTURE_TILE_SIZE: number = 10;
const TEXTURE_SIZE: number = 100;

@Injectable()
export class RenderService {
    private cameraContext: CameraContext;
    private container: HTMLDivElement;
    private _car: Car;
    private dummyCar: Car;
    private renderer: WebGLRenderer;
    private scene: THREE.Scene;
    private stats: Stats;
    private lastDate: number;

    private collisionManager: CollisionManager;

    public get car(): Car {
        return this._car;
    }

    public get CameraContext(): CameraContext {
        return this.cameraContext;
    }

    public constructor() {
        this._car = new Car();
        this.dummyCar = new Car(new Vector3(-15, 0, 0));
        this.collisionManager = new CollisionManager();
    }

    public async initialize(container: HTMLDivElement): Promise<void> {
        if (container) {
            this.container = container;
        }

        await this.createScene();
        this.initStats();
        this.startRenderingLoop();
    }

    public onResize(): void {
        this.cameraContext.onResize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    private initStats(): void {
        this.stats = new Stats();
        this.stats.dom.style.position = "absolute";
        this.container.appendChild(this.stats.dom);
    }

    private update(): void {
        const timeSinceLastFrame: number = Date.now() - this.lastDate;
        this._car.update(timeSinceLastFrame);
        this.dummyCar.update(timeSinceLastFrame);
        this.cameraContext.update(this._car);
        this.lastDate = Date.now();

        this.collisionManager.update();
    }

    // tslint:disable-next-line:max-func-body-length
    private async createScene(): Promise<void> {
        this.scene = new Scene();
        this.cameraContext = new CameraContext();
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

        await this._car.init();
        await this.dummyCar.init();

        this.cameraContext.initStates(this._car.getPosition());
        this.cameraContext.setInitialState();
        this.collisionManager.addCar(this._car);
        this.collisionManager.addCar(this.dummyCar);

        this.scene.add(this._car);
        this.scene.add(this.dummyCar);

        this.scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));

        const skybox: Skybox = new Skybox();
        this.scene.background = skybox.CubeTexture;
        this.scene.add(this.createFloorMesh());
    }

    private createFloorMesh(): Mesh {
        const floorTexture: Texture = new TextureLoader().load("/assets/camero/floor-texture.jpg");
        floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping;
        floorTexture.repeat.set(TEXTURE_TILE_SIZE, TEXTURE_TILE_SIZE);
        const mesh: Mesh = new Mesh(new PlaneBufferGeometry(TEXTURE_SIZE, TEXTURE_SIZE, 1, 1),
                                    new MeshBasicMaterial({ map: floorTexture, side: DoubleSide }));
        mesh.rotation.x = PI_OVER_2;

        return mesh;
    }

    private startRenderingLoop(): void {
        this.renderer = new WebGLRenderer();
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
