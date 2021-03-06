import { Vector3, Matrix4, Object3D, ObjectLoader, Euler, Quaternion, Box3,
         BoxHelper, Raycaster, BoxGeometry, MeshBasicMaterial, Mesh, SpotLight } from "three";
import { Engine, DEFAULT_SHIFT_RPM } from "./engine";
import { MS_TO_SECONDS, RAD_TO_DEG, PI_OVER_4, PI_OVER_2, GRAVITY, HALF } from "../../constants";
import { Wheel } from "./wheel";
import { CarInformation } from "./car-information";

export const DEFAULT_WHEELBASE: number = 2.78;
export const DEFAULT_MASS: number = 1515;
export const DEFAULT_DRAG_COEFFICIENT: number = 0.35;

const MAXIMUM_STEERING_ANGLE: number = 0.25;
const INITIAL_MODEL_ROTATION: Euler = new Euler(0, PI_OVER_2, 0);
const INITIAL_WEIGHT_DISTRIBUTION: number = 0.5;
const NUMBER_REAR_WHEELS: number = 2;
const NUMBER_WHEELS: number = 4;
const NUMBER_OF_HEADLIGHT: number = 2;

const FRONT_X_CORRECTION: number = 0.16;
const FRONT_Z_CORRECTION: number = 0.13;
const BACK_X_CORRECTION: number = 0.13;
const BACK_Z_CORRECTION: number = 0.1;
const EXTRA_BUMPER_LENGTH: number = 0.5;
const MINIMUM_SPEED: number = 0.05;

const LIGHT_COLOR: number = 0xFFFFEE;

export class Car extends Object3D {
    public isAcceleratorPressed: boolean;

    private readonly engine: Engine;
    private readonly mass: number;
    private readonly rearWheel: Wheel;
    private readonly wheelbase: number;
    private readonly dragCoefficient: number;

    private _speed: Vector3;
    private isBraking: boolean;
    private mesh: Object3D;
    private steeringWheelDirection: number;
    private weightRear: number;

    private boundingBox: Box3;
    private hitBox: Mesh;
    private raycasters: Raycaster[];

    private raycasterOffsets: Vector3[];
    private information: CarInformation;
    private headLights: SpotLight[];

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

    public get Information(): CarInformation {
        return this.information;
    }

    public get direction(): Vector3 {
        return new Vector3(0, 0, -1).applyMatrix4(new Matrix4().extractRotation(this.mesh.matrix));
    }

    public constructor(engine: Engine = new Engine()) {
        super();
        this.engine = engine;
        this.rearWheel = new Wheel();
        this.wheelbase = DEFAULT_WHEELBASE;
        this.mass = DEFAULT_MASS;
        this.dragCoefficient = DEFAULT_DRAG_COEFFICIENT;
        this.isBraking = false;
        this.steeringWheelDirection = 0;
        this.weightRear = INITIAL_WEIGHT_DISTRIBUTION;
        this._speed = new Vector3(0, 0, 0);
        this.boundingBox = new Box3();
        this.raycasters = new Array<Raycaster>();
        this.raycasterOffsets = new Array<Vector3>();
        this.information = new CarInformation();
        this.headLights = new Array<SpotLight>();
    }

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
        this.initBoundingBox();
        this.initRaycasters();
        this.initHeadLights();
        this.mesh.setRotationFromEuler(INITIAL_MODEL_ROTATION);
    }

    private initBoundingBox(): void {
        const helper: BoxHelper =  new BoxHelper(this.mesh);
        this.boundingBox.setFromObject(helper);
        const material: MeshBasicMaterial = new MeshBasicMaterial();
        material.visible = false;
        const box: BoxGeometry = new BoxGeometry(this.boundingBox.getSize().x,
                                                 this.boundingBox.getSize().y,
                                                 this.boundingBox.getSize().z + EXTRA_BUMPER_LENGTH);
        this.hitBox = new Mesh(box, material);
        this.mesh.add(this.hitBox);
    }

    private initRaycasters(): void {
        this.setRaycasterOffsets(new Box3().setFromObject(this.mesh));
        this.setRaycastersFromOffsets();
    }

    private initHeadLights(): void {
        const headLightsPosition: Vector3 = this.getHeadlightsPosition(new Box3().setFromObject(this.mesh));
        for (let i: number = 0; i < NUMBER_OF_HEADLIGHT; ++i) {
            const spotRange: number = 7;
            this.headLights.push(new SpotLight(LIGHT_COLOR, 1, spotRange, PI_OVER_4, 0));
            this.mesh.add(this.headLights[i]);

            const targetRight: Object3D = new Object3D();
            this.mesh.add(targetRight);

            targetRight.position.add(headLightsPosition).add(new Vector3(FRONT_X_CORRECTION * Math.pow(-1, i), 0, 0));
            this.headLights[i].target = targetRight;
            const lightCorrectionZ: number = -0.6;
            this.headLights[i].position.add(new Vector3(FRONT_X_CORRECTION * Math.pow(-1, i), 0, lightCorrectionZ));
        }
    }

    private getHeadlightsPosition(box: Box3): Vector3 {
        return new Vector3(0, 1, box.min.x);
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

    public toggleHeadlights(): void {
        this.headLights.forEach((headLight: SpotLight) => {
            headLight.visible = !headLight.visible;
        });
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
        this.rearWheel.angularVelocity += this.getAngularAcceleration() * deltaTime;
        this.engine.update(this._speed.length(), this.rearWheel.radius, this.isGoingForward());
        this.weightRear = this.getWeightDistribution();
        this._speed.add(this.getDeltaSpeed(deltaTime));
        this._speed.setLength(this._speed.length() <= MINIMUM_SPEED ? 0 : this._speed.length());
        this.mesh.position.add(this.getDeltaPosition(deltaTime));
        this.rearWheel.update(this._speed.length());
    }

    private getWeightDistribution(): number {
        const MIN_WEIGHT_DISTRIBUTION: number = 0.25, MAX_WEIGHT_DISTRIBUTION: number = 0.75;
        const acceleration: number = this.getAcceleration().length();
        const distribution: number = this.mass + (1 / this.wheelbase) * this.mass * acceleration * HALF;

        return Math.min(Math.max(MIN_WEIGHT_DISTRIBUTION, distribution), MAX_WEIGHT_DISTRIBUTION);
    }

    private getForces(): Vector3 {
        const resultingForce: Vector3 = new Vector3();

        if (this._speed.length() >= MINIMUM_SPEED) {
            resultingForce.add(this.getDragForce()).add(this.getRollingResistance()).add(this.getLatteralFrictionForce());
        }

        if (this.isAcceleratorPressed) {
            if (!this.isGoingForward()) {
                resultingForce.sub(this.getBrakeForce());
            }
            resultingForce.add(this.direction.multiplyScalar(this.getTractionForce()));
        } else if (this.isBraking) {
            if (this.isGoingForward()) {
                resultingForce.add(this.getBrakeForce());
            } else {
                if (this.engine.rpm < DEFAULT_SHIFT_RPM) {
                    resultingForce.sub(this.direction.multiplyScalar(this.getTractionForce()));
                }
            }
        }

        return resultingForce;
    }

    private getLatteralFrictionForce(): Vector3 {
        const frictionCoefficient: number = 0.05;
        const sideways: Vector3 = this.direction.cross(this.up);
        const sidewaysSpeed: Vector3 = sideways.normalize().multiplyScalar(this.speed.dot(sideways));

        return sidewaysSpeed.normalize().multiplyScalar(frictionCoefficient * GRAVITY * this.mass);
    }

    private getRollingResistance(): Vector3 {
        const tirePressure: number = 1;
        // formula taken from: https://www.engineeringtoolbox.com/rolling-friction-resistance-d_1303.html
        // tslint:disable-next-line:no-magic-numbers
        const rollingCoefficient: number = (1 / tirePressure) * (Math.pow(this.speed.length() * 3.6 / 100, 2) * 0.0095 + 0.01) + 0.005;

        return this.direction.multiplyScalar(rollingCoefficient * this.mass * GRAVITY * this.goingBackwards());
    }

    private getDragForce(): Vector3 {
        const carSurface: number = 3;
        const airDensity: number = 1.2;
        const resistance: Vector3 = this.direction;
        resistance.multiplyScalar(airDensity * carSurface * -this.dragCoefficient *
            this.speed.length() * this.speed.length() * this.goingBackwards());

        return resistance;
    }

    private goingBackwards(): number {
        return Math.sign(this._speed.dot(this.direction.normalize()));
    }

    private getTractionForce(): number {
        const force: number = this.getEngineForce();
        const maxForce: number =
            this.rearWheel.frictionCoefficient * this.mass * GRAVITY * this.weightRear * NUMBER_REAR_WHEELS / NUMBER_WHEELS;

        return -Math.min(force, maxForce);
    }

    private getAngularAcceleration(): number {
        return this.getTotalTorque() / (this.rearWheel.inertia * NUMBER_REAR_WHEELS);
    }

    private getBrakeForce(): Vector3 {
        return this.direction.multiplyScalar(this.rearWheel.frictionCoefficient * this.mass * GRAVITY);
    }

    private getBrakeTorque(): number {
        return this.getBrakeForce().length() * this.rearWheel.radius;
    }

    private getTractionTorque(): number {
        return this.getTractionForce() * this.rearWheel.radius;
    }

    private getTotalTorque(): number {
        return this.getTractionTorque() * NUMBER_REAR_WHEELS + this.getBrakeTorque();
    }

    private getEngineForce(): number {
        return this.engine.getDriveTorque() / this.rearWheel.radius;
    }

    private getAcceleration(): Vector3 {
        return this.getForces().divideScalar(this.mass);
    }

    private getDeltaSpeed(deltaTime: number): Vector3 {
        return this.getAcceleration().multiplyScalar(deltaTime);
    }

    private getDeltaPosition(deltaTime: number): Vector3 {
        return this.speed.multiplyScalar(deltaTime);
    }

    protected isGoingForward(): boolean {
        return this.speed.normalize().dot(this.direction) > MINIMUM_SPEED;
    }
}
