import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import { PerspectiveCamera, WebGLRenderer, Scene, AmbientLight,
         AxisHelper, Mesh, PlaneBufferGeometry, MeshBasicMaterial,
         DoubleSide, Math, Vector3, Texture, RepeatWrapping, TextureLoader } from "three";
import { Car } from "../car/car";

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;

const ACCELERATE_KEYCODE: number = 87;  // w
const LEFT_KEYCODE: number = 65;        // a
const BRAKE_KEYCODE: number = 83;       // s
const RIGHT_KEYCODE: number = 68;       // d

const INITIAL_CAMERA_POSITION_Y: number = 25;

const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.5;

@Injectable()
export class RenderService {
    private camera: PerspectiveCamera;
    private container: HTMLDivElement;
    private _car: Car;
    private renderer: WebGLRenderer;
    private scene: THREE.Scene;
    private stats: Stats;
    private lastDate: number;

    public get car(): Car {
        return this._car;
    }

    public constructor() {
        this._car = new Car();
    }

    public async initialize(container: HTMLDivElement): Promise<void> {
        if (container) {
            this.container = container;
        }

        await this.createScene();
        this.initStats();
        this.startRenderingLoop();
    }

    private initStats(): void {
        this.stats = new Stats();
        this.stats.dom.style.position = "absolute";
        this.container.appendChild(this.stats.dom);
    }

    private update(): void {
        const timeSinceLastFrame: number = Date.now() - this.lastDate;
        this._car.update(timeSinceLastFrame);

        const RELATIVE_CAMERA_OFFSET: Vector3 = new Vector3(0, 2, 5);
        let absoluteCarPosition: Vector3 = RELATIVE_CAMERA_OFFSET.applyMatrix4(this._car.getWorldMatrix());
        this.camera.position.x = absoluteCarPosition.x;
        this.camera.position.y = absoluteCarPosition.y;
        this.camera.position.z = absoluteCarPosition.z;

        this.camera.lookAt(this._car.getPosition());
        this.lastDate = Date.now();
    }

    private async createScene(): Promise<void> {
        this.scene = new Scene();

        this.camera = new PerspectiveCamera(
            FIELD_OF_VIEW,
            this.getAspectRatio(),
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );

        await this._car.init();
        this.camera.position.set(0, INITIAL_CAMERA_POSITION_Y, 0);
        this.camera.lookAt(this._car.position);
        this.scene.add(this._car);
        this.scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));

        // Ajout
        const axesHelper: AxisHelper = new AxisHelper(5);
        this.scene.add( axesHelper );

        const floorTexture: Texture = new TextureLoader().load("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAEAAQADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigD4AooooAKKKKACiiigAooooA+/6KKKACiiigAooooAKKKKAPgCiiigAooooAKKKKACiiigD7/ooooAKKKKACiiigAooooA+AKKKKACiiigAooooAKKKKAPv+iiigAooooAKKKKACiiigD4AooooAKKKKACiiigAooooA+/6KKKACiiigAooooAKKKKAPgCiiigAooooAKKKKACiiigD7/ooooAKKKKACiiigAooooA+AKKKKACiiigAooooAKKKKAPv+iiigAooooAKKKKACiiigD4AooooAKKKKACiiigAooooA+/6KKKACiiigAooooAKKKKAPgCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA+/6KKKACiiigAooooAKKKKAPgCiiigAooooAKKKKACiiigD7/ooooAKKKKACiiigAooooA+AKKKKACiiigAooooAKKKKAPv+iiigAooooAKKKKACiiigD4AooooAKKKKACiiigAooooA+/6KKKACiiigAooooAKKKKAPgCiiigAooooAKKKKACiiigD7/ooooAKKKKACiiigAooooA+AKKKKACiiigAooooAKKKKAPv+iiigAooooAKKKKACiiigD4AooooAKKKKACiiigAooooA+/6KKKACiiigAooooAKKKKAPgCiiigAooooAKKKKACiiigD7/ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAPgCiiigAooooAKKKKACiiigD7/ooooAKKKKACiiigAooooA+AKKKKACiiigAooooAKKKKAPv+iiigAooooAKKKKACiiigD4AooooAKKKKACiiigAooooA+/6KKKACiiigAooooAKKKKAPgCiiigAooooAKKKKACiiigD7/ooooAKKKKACiiigAooooA+AKKKKACiiigAooooAKKKKAPv+iiigAooooAKKKKACiiigD4AooooAKKKKACiiigAooooA+/6KKKACiiigAooooAKKKKAPgCiiigAooooAKKKKACiiigD7/ooooAKKKKACiiigAooooA+AKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD7/ooooAKKKKACiiigAooooA+AKKKKACiiigAooooAKKKKAPv+iiigAooooAKKKKACiiigD4AooooAKKKKACiiigAooooA+/6KKKACiiigAooooAKKKKAPgCiiigAooooAKKKKACiiigD7/ooooAKKKKACiiigAooooA+AKKKKACiiigAooooAKKKKAPv+iiigAooooAKKKKACiiigD4AooooAKKKKACiiigAooooA+/6KKKACiiigAooooAKKKKAPgCiiigAooooAKKKKACiiigD7/ooooAKKKKACiiigAooooA+AKKKKACiiigAooooAKKKKAPv+iiigAooooAKKKKACiiigD//2Q==");
        floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping;
        floorTexture.repeat.set(10, 10);
        const geometry: PlaneBufferGeometry = new PlaneBufferGeometry( 100, 100, 8, 8 );
        const material: MeshBasicMaterial = new MeshBasicMaterial( { map: floorTexture, side: DoubleSide } );
        const mesh: Mesh = new Mesh( geometry, material );
        mesh.position.y = -0.5;
        mesh.rotation.x = Math.degToRad(90);
        this.scene.add( mesh );
    }

    private getAspectRatio(): number {
        return this.container.clientWidth / this.container.clientHeight;
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
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
    }

    public onResize(): void {
        this.camera.aspect = this.getAspectRatio();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    // TODO: Create an event handler service.
    public handleKeyDown(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case ACCELERATE_KEYCODE:
                this._car.isAcceleratorPressed = true;
                break;
            case LEFT_KEYCODE:
                this._car.steerLeft();
                break;
            case RIGHT_KEYCODE:
                this._car.steerRight();
                break;
            case BRAKE_KEYCODE:
                this._car.brake();
                break;
            default:
                break;
        }
    }

    // TODO: Create an event handler service.
    public handleKeyUp(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case ACCELERATE_KEYCODE:
                this._car.isAcceleratorPressed = false;
                break;
            case LEFT_KEYCODE:
            case RIGHT_KEYCODE:
                this._car.releaseSteering();
                break;
            case BRAKE_KEYCODE:
                this._car.releaseBrakes();
                break;
            default:
                break;
        }
    }
}
