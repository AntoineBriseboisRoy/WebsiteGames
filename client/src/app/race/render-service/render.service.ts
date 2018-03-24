import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import { WebGLRenderer, Scene, AmbientLight,
         Mesh, PlaneBufferGeometry, MeshBasicMaterial,
         Vector2, BackSide,
         DoubleSide, Texture, RepeatWrapping, TextureLoader, Vector3,
         CircleBufferGeometry, ArrowHelper, Raycaster, CylinderGeometry } from "three";
import { Car } from "../car/car";
import { ThirdPersonCamera } from "../camera/camera-perspective";
import { TopViewCamera } from "../camera/camera-orthogonal";
import { INITIAL_CAMERA_POSITION_Y, FRUSTUM_RATIO, PI_OVER_2, HALF } from "../../constants";
import { Skybox } from "../skybox/skybox";
import { CameraContext } from "../camera/camera-context";
import { ITrack, TrackType } from "../../../../../common/interfaces/ITrack";
import { CollisionManager } from "../car/collision-manager";

export const FAR_CLIPPING_PLANE: number = 1000;
export const NEAR_CLIPPING_PLANE: number = 1;
export const FIELD_OF_VIEW: number = 70;

const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.5;
const TEXTURE_TILE_REPETIONS: number = 200;
const WORLD_SIZE: number = 1000;
const FLOOR_SIZE: number = WORLD_SIZE / HALF;
const ROAD_WIDTH: number = 10;
const SUPERPOSITION: number = 0.001;

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
    private superposition: number;
    private activeTrack: ITrack;
    private floorTextures: Map<TrackType, Texture>;

    private collisionManager: CollisionManager;

    private arrows: ArrowHelper[];

    public get car(): Car {
        return this._car;
    }

    public get CameraContext(): CameraContext {
        return this.cameraContext;
    }

    public constructor() {
        this._car = new Car();
        this.floorTextures = new Map<TrackType, Texture>();
        this.superposition = 0;
        this.dummyCar = new Car(new Vector3(-15, 0, 0));
        this.collisionManager = new CollisionManager();
        this.arrows = new Array<ArrowHelper>();
    }

    public async initialize(container: HTMLDivElement, track: ITrack): Promise<void> {
        if (container) {
            this.container = container;
        }
        this.activeTrack = track;
        this.initFloorTextures();

        await this.createScene();
        this.initStats();
        this.startRenderingLoop();
        this.updateArrows();
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

    private initFloorTextures(): void {
        const textureLoader: TextureLoader = new TextureLoader();
        this.floorTextures.set(TrackType.DESERT, textureLoader.load("/assets/desert.jpg"));
        this.floorTextures.set(TrackType.REGULAR, textureLoader.load("/assets/grass.jpg"));
    }

    private updateArrows(): void {
        const raycasters: Array<Raycaster> = this._car.Raycasters;
        while (this.arrows.length > 0) {
            this.scene.remove(this.arrows.pop());
        }
        for (let i: number = 0; i < raycasters.length; i++) {
            this.arrows.push(new ArrowHelper(raycasters[i].ray.direction, raycasters[i].ray.origin, 2, 0xff0000, 0.5, 0.1));
            this.scene.add(this.arrows[i]);
        }
    }

    private update(): void {
        const timeSinceLastFrame: number = Date.now() - this.lastDate;
        this._car.update(timeSinceLastFrame);
        this.dummyCar.update(timeSinceLastFrame);
        this.cameraContext.update(this._car);
        this.lastDate = Date.now();

        this.collisionManager.update();
        this.updateArrows();
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
        // this.scene.add(this.dummyCar);

        this.scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));

        const skybox: Skybox = new Skybox();
        this.scene.background = skybox.CubeTexture;
        this.createFloorMesh();
        this.generateTrack();
    }

    private generateTrack(): void {
        for (let i: number = 0; i < this.activeTrack.points.length - 1; ++i) {
            this.createRoadSegment(i);
            this.createIntersection(i);
            this.createIntersectionWall(i + 1);
        }
    }

    // tslint:disable-next-line:max-func-body-length
    private createRoadSegment(index: number): void {
        const trackTexture: Texture = new TextureLoader().load("/assets/road.jpg");
        trackTexture.wrapS = RepeatWrapping;

        const trackDirection: Vector3 = new Vector3(this.activeTrack.points[(index + 1) % this.activeTrack.points.length].x -
                                                    this.activeTrack.points[index].x,
                                                    0,
                                                    this.activeTrack.points[(index + 1) % this.activeTrack.points.length].y -
                                                    this.activeTrack.points[index].y);
        trackTexture.repeat.set(trackDirection.length() * TEXTURE_TILE_REPETIONS, 1);

        const direction: Vector3 = new Vector3(0, 1, 0).cross(trackDirection);

        const plane: PlaneBufferGeometry = new PlaneBufferGeometry(trackDirection.length() * WORLD_SIZE, ROAD_WIDTH);
        const planeInside: PlaneBufferGeometry = new PlaneBufferGeometry(trackDirection.length() * WORLD_SIZE - ROAD_WIDTH, ROAD_WIDTH);
        const planeOutside: PlaneBufferGeometry = new PlaneBufferGeometry(trackDirection.length() * WORLD_SIZE - ROAD_WIDTH, ROAD_WIDTH);

        const mesh: Mesh[] = new Array<Mesh>();
        mesh.push( new Mesh(plane, new MeshBasicMaterial({ map: trackTexture, side: BackSide })));
        mesh.push(new Mesh(planeInside, new MeshBasicMaterial({ map: trackTexture, side: DoubleSide })));
        mesh.push(new Mesh(planeOutside, new MeshBasicMaterial({ map: trackTexture, side: DoubleSide })));

        const meshPositionWorld: Vector2 = new Vector2(-(this.activeTrack.points[index].y + trackDirection.z * HALF)
                                                       * WORLD_SIZE + WORLD_SIZE * HALF,
                                                       -(this.activeTrack.points[index].x + trackDirection.x * HALF)
                                                       * WORLD_SIZE + WORLD_SIZE * HALF);

        this.createRoad(mesh[0], trackDirection, meshPositionWorld);

        const distanceRoadBorder: Vector2 = new Vector2(direction.normalize().z * ROAD_WIDTH * HALF,
                                                        direction.normalize().x * ROAD_WIDTH * HALF);

        this.createWall(mesh[1], trackDirection, meshPositionWorld, new Vector2(-distanceRoadBorder.x, -distanceRoadBorder.y));
        this.createWall(mesh[2], trackDirection, meshPositionWorld, distanceRoadBorder);
    }

    private createRoad(mesh: Mesh, trackDirection: Vector3, meshPositionWorld: Vector2): void {
        mesh.position.x = meshPositionWorld.x;
        mesh.position.z = meshPositionWorld.y;
        mesh.rotation.x = PI_OVER_2;
        mesh.rotation.z = trackDirection.z === 0 ? PI_OVER_2 : Math.atan(trackDirection.x / trackDirection.z);
        this.superpose(mesh);

        this.scene.add(mesh);
    }

    private createWall(mesh: Mesh, trackDirection: Vector3, meshPositionWorld: Vector2, distanceRoadBorder: Vector2): void {
        mesh.position.x = meshPositionWorld.x + distanceRoadBorder.x;
        mesh.position.z = meshPositionWorld.y + distanceRoadBorder.y;
        mesh.rotation.y = trackDirection.x === 0 ? 0 : Math.atan(trackDirection.z / trackDirection.x) + PI_OVER_2;

        this.scene.add(mesh);
        this.collisionManager.addWall(mesh);
    }

    private createIntersection(index: number): void {
        const POLYGONS_NUMBER: number = 32;
        const trackTexture: Texture = new TextureLoader().load("/assets/road.jpg");
        const circle: CircleBufferGeometry = new CircleBufferGeometry(ROAD_WIDTH * HALF, POLYGONS_NUMBER);
        const mesh: Mesh = new Mesh(circle, new MeshBasicMaterial({ map: trackTexture, side: BackSide }));

        mesh.position.x = -(this.activeTrack.points[index].y) * WORLD_SIZE + WORLD_SIZE * HALF;
        mesh.position.z = -(this.activeTrack.points[index].x) * WORLD_SIZE + WORLD_SIZE * HALF;
        mesh.rotation.x = PI_OVER_2;
        this.superpose(mesh);

        this.scene.add(mesh);
    }

    // TODO: Calculate 2 angles from wall length - segment length (and refactor into 2 methods)
    private createIntersectionWall(index: number): void {
        const vectorA: Vector3 = new Vector3(this.activeTrack.points[(index + 1) % this.activeTrack.points.length].x -
                                             this.activeTrack.points[index].x,
                                             0,
                                             this.activeTrack.points[(index + 1) % this.activeTrack.points.length].y -
                                             this.activeTrack.points[index].y);
        const vectorB: Vector3 = new Vector3(this.activeTrack.points[index].x -
                                             this.activeTrack.points[(index - 1) % this.activeTrack.points.length].x,
                                             0, this.activeTrack.points[index].y -
                                             this.activeTrack.points[(index - 1) % this.activeTrack.points.length].y);

        const small: number = vectorB.angleTo(new Vector3(1, 0, 0)); // Default start is 0, equiv. to 3 o'clock.
        const thetaLength: number = vectorA.angleTo(vectorB);
        const thetaStart: number = small + thetaLength;

        const geometry: CylinderGeometry = new CylinderGeometry(ROAD_WIDTH * HALF, ROAD_WIDTH * HALF, ROAD_WIDTH * HALF,
                                                                15, 1, true, thetaStart, thetaLength);
        const cornerWall: Mesh = new Mesh(geometry, new MeshBasicMaterial({ color: 0xFFFF00, side: DoubleSide}));

        cornerWall.position.x = -(this.activeTrack.points[index].y) * WORLD_SIZE + WORLD_SIZE * HALF;
        cornerWall.position.y = ROAD_WIDTH * HALF * HALF;
        cornerWall.position.z = -(this.activeTrack.points[index].x) * WORLD_SIZE + WORLD_SIZE * HALF;

        this.scene.add(cornerWall);
        this.collisionManager.addWall(cornerWall);
    }

    private createFloorMesh(): void {
        this.floorTextures.get(this.activeTrack.type).wrapS = this.floorTextures.get(this.activeTrack.type).wrapT = RepeatWrapping;
        this.floorTextures.get(this.activeTrack.type).repeat.set(TEXTURE_TILE_REPETIONS, TEXTURE_TILE_REPETIONS);
        const mesh: Mesh = new Mesh(new PlaneBufferGeometry(FLOOR_SIZE, FLOOR_SIZE, 1, 1),
                                    new MeshBasicMaterial({ map: this.floorTextures.get(this.activeTrack.type), side: BackSide }));
        mesh.rotation.x = PI_OVER_2;

        this.scene.add(mesh);
    }

    private superpose(mesh: Mesh): void {
        this.superposition += SUPERPOSITION;
        mesh.position.y = this.superposition;
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
