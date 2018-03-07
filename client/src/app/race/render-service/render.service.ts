import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import { WebGLRenderer, Scene, AmbientLight,
         Mesh, PlaneBufferGeometry, MeshBasicMaterial,
         DoubleSide, Texture, RepeatWrapping, TextureLoader, Vector2, BackSide, Vector3 } from "three";
import { Car } from "../car/car";
import { ThirdPersonCamera } from "../camera/camera-perspective";
import { TopViewCamera } from "../camera/camera-orthogonal";
import { INITIAL_CAMERA_POSITION_Y, FRUSTUM_RATIO, PI_OVER_2, PI_OVER_4 } from "../../constants";
import { Skybox } from "../skybox/skybox";
import { CameraContext } from "../camera/camera-context";
import { Point } from "../edit-track/Geometry";

export const FAR_CLIPPING_PLANE: number = 1000;
export const NEAR_CLIPPING_PLANE: number = 1;
export const FIELD_OF_VIEW: number = 70;

const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.5;
const TEXTURE_TILE_REPETIONS: number = 100;
const TEXTURE_SIZE: number = 1000;

@Injectable()
export class RenderService {
    private cameraContext: CameraContext;
    private container: HTMLDivElement;
    private _car: Car;
    private renderer: WebGLRenderer;
    private scene: THREE.Scene;
    private stats: Stats;
    private lastDate: number;
    private points: Point[];

    public get car(): Car {
        return this._car;
    }

    public get CameraContext(): CameraContext {
        return this.cameraContext;
    }

    public constructor() {
        this._car = new Car();
    }

    public async initialize(container: HTMLDivElement, points: Point[]): Promise<void> {
        if (container) {
            this.container = container;
        }
        this.points = points;

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
        this.cameraContext.update(this._car);
        this.lastDate = Date.now();
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
        this.cameraContext.initStates(this._car.getPosition());
        this.cameraContext.setInitialState();
        this.scene.add(this._car);
        this.scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));

        const skybox: Skybox = new Skybox();
        this.scene.background = skybox.CubeTexture;
        this.scene.add(this.createFloorMesh());
        this.generateTrack();
    }

    private generateTrack(): void {
        const trackTexture: Texture = new TextureLoader().load("/assets/camero/road.jpg");
        trackTexture.wrapS = trackTexture.wrapT = RepeatWrapping;
        trackTexture.repeat.set(1, 1);
        for (let i: number = 0; i < this.points.length - 1; ++i) {
            let vector: Vector2 = new Vector2(this.points[i + 1].x - this.points[i].x, this.points[i + 1].y - this.points[i].y);
            const mesh: Mesh = new Mesh(new PlaneBufferGeometry(vector.length() * TEXTURE_SIZE, 10),
                                        new MeshBasicMaterial({ map: trackTexture, side: BackSide }));
            mesh.position.x = -(this.points[i].y + vector.y / 2) * TEXTURE_SIZE;
            mesh.position.z = -(this.points[i].x + vector.x / 2) * TEXTURE_SIZE;
            mesh.rotation.x = PI_OVER_2;
            mesh.rotation.z = vector.y === 0 ? PI_OVER_2 : Math.atan(vector.x / vector.y);
            this.scene.add(mesh);
        }
    }

    private createFloorMesh(): Mesh {
        const floorTexture: Texture = new TextureLoader().load("/assets/camero/floor-texture.jpg");
        floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping;
        floorTexture.repeat.set(TEXTURE_TILE_REPETIONS, TEXTURE_TILE_REPETIONS);
        const mesh: Mesh = new Mesh(new PlaneBufferGeometry(TEXTURE_SIZE, TEXTURE_SIZE, 1, 1),
                                    new MeshBasicMaterial({ map: floorTexture, side: BackSide }));
        mesh.rotation.x = PI_OVER_2;
        mesh.position.y = -0.01;

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
