import { Vector3, Matrix4, Object3D, ObjectLoader, Euler, Quaternion, Box3,
         BoxHelper, Raycaster, BoxGeometry, MeshBasicMaterial, Mesh } from "three";
import { Engine } from "./engine";
import { MS_TO_SECONDS, PI_OVER_2, RAD_TO_DEG } from "../../constants";
import { Wheel } from "./wheel";
import { ForcesManager } from "./forces-manager";
import { IPhysicsObject, IRotationalObject } from "./physics-interfaces";

export const DEFAULT_WHEELBASE: number = 2.78;
export const DEFAULT_MASS: number = 1515;
export const DEFAULT_DRAG_COEFFICIENT: number = 0.35;

const MAXIMUM_STEERING_ANGLE: number = 0.25;
const INITIAL_MODEL_ROTATION: Euler = new Euler(0, PI_OVER_2, 0);
const INITIAL_WEIGHT_DISTRIBUTION: number = 0.5;
const NUMBER_REAR_WHEELS: number = 2;
const NUMBER_WHEELS: number = 4;
const FRONT_X_CORRECTION: number = 0.16;
const FRONT_Z_CORRECTION: number = 0.13;
const BACK_X_CORRECTION: number = 0.13;
const BACK_Z_CORRECTION: number = 0.1;
const MINIMUM_SPEED: number = 0.05;
const FRONTAL_SURFACE: number = 3;

export class Car extends Object3D {
    public isAcceleratorPressed: boolean;

    private readonly engine: Engine;
    private readonly mass: number;
    private readonly rearWheel: Wheel;
    private readonly wheelbase: number;
    private readonly dragCoefficient: number;

    private readonly initialPosition: Vector3;

    private _speed: Vector3;
    private isBraking: boolean;
    private mesh: Object3D;
    private steeringWheelDirection: number;
    private weightRear: number;

    private boundingBox: Box3;
    private hitBox: Mesh;
    private raycasters: Raycaster[];

    private raycasterOffsets: Vector3[];

    public get Mass(): number {
        return this.mass;
    }

    public get speed(): Vector3 {
        return this._speed.clone();
    }

    public set speed(newSpeed: Vector3) {
        this._speed = newSpeed;
    }

    public get currentGear(): number {
        return this.engine.currentGear;
    }

    public get rpm(): number {
        return this.engine.rpm;
    }

    public get BoundingBox(): Box3 {
        return this.boundingBox;
    }

    public get angle(): number {
        return this.mesh.rotation.y * RAD_TO_DEG;
    }

    public get Raycasters(): Array<Raycaster> {
        return this.raycasters;
    }

    public getWorldMatrix(): Matrix4 {
      return this.mesh.matrixWorld;
    }

    public getPosition(): Vector3 {
      return this.mesh.position;
    }

    public getRotation(): Euler {
        return this.mesh.rotation;
    }

    public getMeshMatrix(): Matrix4 {
        return this.mesh.matrix;
    }

    public get direction(): Vector3 {
        const rotationMatrix: Matrix4 = new Matrix4();
        rotationMatrix.extractRotation(this.mesh.matrix);
        const carDirection: Vector3 = new Vector3(0, 0, -1);
        carDirection.applyMatrix4(rotationMatrix);

        return carDirection;
    }

    public constructor(
        initialPosition: Vector3 = new Vector3(), engine: Engine = new Engine(),
        rearWheel: Wheel = new Wheel(), wheelbase: number = DEFAULT_WHEELBASE,
        mass: number = DEFAULT_MASS, dragCoefficient: number = DEFAULT_DRAG_COEFFICIENT) {
        super();

        this.engine = engine;
        this.rearWheel = rearWheel;
        this.wheelbase = wheelbase;
        this.mass = mass;
        this.dragCoefficient = dragCoefficient;
        this.initialPosition = initialPosition;
        this.isBraking = false;
        this.steeringWheelDirection = 0;
        this.weightRear = INITIAL_WEIGHT_DISTRIBUTION;
        this._speed = new Vector3(0, 0, 0);
        this.boundingBox = new Box3();
        this.raycasters = new Array<Raycaster>();
        this.raycasterOffsets = new Array<Vector3>();
    }

    // tslint:disable-next-line:no-suspicious-comment
    // TODO: move loading code outside of car class.
    private async load(): Promise<Object3D> {
        return new Promise<Object3D>((resolve, reject) => {
            const loader: ObjectLoader = new ObjectLoader();
            loader.load("../../assets/camero/camero-2010-low-poly.json", (object) => {
                resolve(object);
            });
        });
    }

    public async init(): Promise<void> {
        this.mesh = await this.load();
        this.add(this.mesh);
        this.mesh.setRotationFromEuler(INITIAL_MODEL_ROTATION);
        this.initBoundingBox();
        this.mesh.position.add(this.initialPosition);
        this.initRaycasters();
    }

    private initBoundingBox(): void {
        const helper: BoxHelper =  new BoxHelper(this.mesh);
        this.boundingBox.setFromObject(helper);
        const material: MeshBasicMaterial = new MeshBasicMaterial();
        material.visible = false;
        const box: BoxGeometry = new BoxGeometry(this.boundingBox.getSize().z,
                                                 this.boundingBox.getSize().y,
                                                 this.boundingBox.getSize().x);
        this.hitBox = new Mesh(box, material);
        this.mesh.add(this.hitBox);
    }

    private initRaycasters(): void {
        this.setRaycasterOffsets(new Box3().setFromObject(this.mesh));
        this.setRaycastersFromOffsets();
    }

    private setRaycastersFromOffsets(): void {
        this.raycasterOffsets.forEach((offset: Vector3) => {
            this.raycasters.push(new Raycaster(offset.clone().add(this.getPosition()), new Vector3(0, -1, 0)));
        });
    }

    private setRaycasterOffsets(box: Box3): void {
        this.raycasterOffsets.push(new Vector3(box.min.x, 1, 0));
        this.raycasterOffsets.push(new Vector3(box.min.x + FRONT_X_CORRECTION, 1, box.max.z - FRONT_Z_CORRECTION));
        this.raycasterOffsets.push(new Vector3(box.min.x + FRONT_X_CORRECTION, 1, box.max.z + FRONT_Z_CORRECTION));
        this.raycasterOffsets.push(new Vector3(box.max.x, 1, 0));
        this.raycasterOffsets.push(new Vector3(box.max.x - BACK_X_CORRECTION, 1, box.max.z - BACK_Z_CORRECTION));
        this.raycasterOffsets.push(new Vector3(box.max.x - BACK_X_CORRECTION, 1, box.max.z + BACK_Z_CORRECTION));
    }

    public steerLeft(): void {
        this.steeringWheelDirection = MAXIMUM_STEERING_ANGLE;
    }

    public steerRight(): void {
        this.steeringWheelDirection = -MAXIMUM_STEERING_ANGLE;
    }

    public releaseSteering(): void {
        this.steeringWheelDirection = 0;
    }

    public releaseBrakes(): void {
        this.isBraking = false;
    }

    public brake(): void {
        this.isBraking = true;
    }

    public rotateMeshY(omega: number): void {
        this.mesh.rotateY(omega);
    }

    public update(deltaTime: number): void {
        deltaTime = deltaTime / MS_TO_SECONDS;

        // Move to car coordinates
        const rotationMatrix: Matrix4 = new Matrix4();
        rotationMatrix.extractRotation(this.mesh.matrix);
        const rotationQuaternion: Quaternion = new Quaternion();
        rotationQuaternion.setFromRotationMatrix(rotationMatrix);
        this._speed.applyMatrix4(rotationMatrix);

        // Physics calculations
        this.physicsUpdate(deltaTime);

        const R: number = DEFAULT_WHEELBASE / Math.sin(this.steeringWheelDirection * deltaTime);
        const theta: number = this._speed.length() / R;
        this.updateRaycasters(deltaTime, theta);

        // Move back to world coordinates
        this.updateBoundingBox();
        this._speed = this.speed.applyQuaternion(rotationQuaternion.inverse());

        // Angular rotation of the car
        const omega: number = this._speed.length() / R;
        this.rotateMeshY(omega);
    }

    private updateRaycasters(deltaTime: number, theta: number): void {
        const rotationMatrix: Matrix4 = new Matrix4().makeRotationY(theta);

        for (let i: number = 0; i < this.raycasters.length; i++) {
            this.raycasters[i].ray.origin = this.getPosition().clone().add(this.raycasterOffsets[i]);
            this.raycasters[i].ray.origin = this.raycasters[i].ray.origin.sub(this.getPosition().clone());
            this.raycasters[i].ray.applyMatrix4(rotationMatrix);
            this.raycasters[i].ray.origin.add(this.getPosition().clone());
        }
    }

    private updateBoundingBox(): void {
        this.boundingBox.setFromObject(this.mesh);
    }

    private physicsUpdate(deltaTime: number): void {
        this.rearWheel.angularVelocity += ForcesManager.getAngularAcceleration(this.getAssociatedIPhysicsObject(),
                                                                               this.getAssociatedRotationalObject()) * deltaTime;
        this.engine.update(this._speed.length(), this.rearWheel.radius);
        this.weightRear = this.getWeightDistribution();
        this._speed.add(ForcesManager.getDeltaSpeed(this.getAssociatedIPhysicsObject(), deltaTime));
        this._speed.setLength(this._speed.length() <= MINIMUM_SPEED ? 0 : this._speed.length());
        this.mesh.position.add(ForcesManager.getDeltaPosition(this.getAssociatedIPhysicsObject(), deltaTime));
        this.rearWheel.update(this._speed.length());
    }

    private getWeightDistribution(): number {
        const acceleration: number = ForcesManager.getAcceleration(this.getAssociatedIPhysicsObject()).length();
        /* tslint:disable:no-magic-numbers */
        const distribution: number = this.mass + (1 / this.wheelbase) * this.mass * acceleration / 2;

        return Math.min(Math.max(0.25, distribution), 0.75);
        /* tslint:enable:no-magic-numbers */
    }

    private getEngineForce(): number {
        return this.engine.getDriveTorque() / this.rearWheel.radius;
    }

    private getAssociatedIPhysicsObject(): IPhysicsObject {
        return { mass: this.mass, dragCoefficient: this.dragCoefficient,
                 frontalSurface: FRONTAL_SURFACE, frictionCoefficient: this.rearWheel.frictionCoefficient,
                 initialForce: this.getEngineForce(), weightRear: this.weightRear,
                 nContactPoints: NUMBER_WHEELS, nRearContactPoints: NUMBER_REAR_WHEELS,
                 direction: this.direction, speed: this.speed, up: this.up,
                 isAccelerating: this.isAcceleratorPressed, isDecelerating: this.isBraking };
    }

    private getAssociatedRotationalObject(): IRotationalObject {
        return { radius: this.rearWheel.radius, inertia: this.rearWheel.inertia };
    }
}
