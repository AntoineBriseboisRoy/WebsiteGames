import { Vector3, Matrix4, Object3D, ObjectLoader, Euler, Quaternion, Box3, BoxHelper, Raycaster } from "three";
import { Engine } from "./engine";
import { MS_TO_SECONDS, GRAVITY, PI_OVER_2, RAD_TO_DEG } from "../../constants";
import { Wheel } from "./wheel";

export const DEFAULT_WHEELBASE: number = 2.78;
export const DEFAULT_MASS: number = 1515;
export const DEFAULT_DRAG_COEFFICIENT: number = 0.35;

const MAXIMUM_STEERING_ANGLE: number = 0.25;
const INITIAL_MODEL_ROTATION: Euler = new Euler(0, PI_OVER_2, 0);
const INITIAL_WEIGHT_DISTRIBUTION: number = 0.5;
const MINIMUM_SPEED: number = 0.05;
const NUMBER_REAR_WHEELS: number = 2;
const NUMBER_WHEELS: number = 4;

const RAYCASTER_ANGLE: number = Math.PI / 8;

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
    private raycasters: Raycaster[];

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

    public getMeshMatrix(): Matrix4 {
        return this.mesh.matrix;
    }

    private get direction(): Vector3 {
        const rotationMatrix: Matrix4 = new Matrix4();
        const carDirection: Vector3 = new Vector3(0, 0, -1);

        rotationMatrix.extractRotation(this.mesh.matrix);
        carDirection.applyMatrix4(rotationMatrix);

        return carDirection;
    }

    public constructor(
        initialPosition: Vector3 = new Vector3(),
        engine: Engine = new Engine(),
        rearWheel: Wheel = new Wheel(),
        wheelbase: number = DEFAULT_WHEELBASE,
        mass: number = DEFAULT_MASS,
        dragCoefficient: number = DEFAULT_DRAG_COEFFICIENT) {
        super();

        if (wheelbase <= 0) {
            console.error("Wheelbase should be greater than 0.");
            wheelbase = DEFAULT_WHEELBASE;
        }
        if (mass <= 0) {
            console.error("Mass should be greater than 0.");
            mass = DEFAULT_MASS;
        }
        if (dragCoefficient <= 0) {
            console.error("Drag coefficient should be greater than 0.");
            dragCoefficient = DEFAULT_DRAG_COEFFICIENT;
        }

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
        // this.mesh.position.y = 20;
        this.add(this.mesh);
        this.initBoundingBox();
        this.initRaycasters();
        this.mesh.position.add(this.initialPosition);
        this.mesh.setRotationFromEuler(INITIAL_MODEL_ROTATION);
    }

    private initBoundingBox(): void {
        const helper: BoxHelper =  new BoxHelper(this.mesh);
        this.boundingBox.setFromObject(helper);
        this.mesh.add(helper);
    }

    private initRaycasters(): void {
        this.raycasters.push(new Raycaster(this.getPosition(), new Vector3(1, 0, 0)));
        this.raycasters.push(new Raycaster(this.getPosition(), new Vector3(Math.cos(RAYCASTER_ANGLE), 0, Math.sin(RAYCASTER_ANGLE))));
        this.raycasters.push(new Raycaster(this.getPosition(), new Vector3(Math.cos(RAYCASTER_ANGLE), 0, -Math.sin(RAYCASTER_ANGLE))));
        this.raycasters.push(new Raycaster(this.getPosition(), new Vector3(-1, 0, 0)));
        this.raycasters.push(new Raycaster(this.getPosition(), new Vector3(-Math.cos(RAYCASTER_ANGLE), 0, Math.sin(RAYCASTER_ANGLE))));
        this.raycasters.push(new Raycaster(this.getPosition(), new Vector3(-Math.cos(RAYCASTER_ANGLE), 0, -Math.sin(RAYCASTER_ANGLE))));
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

        // Move back to world coordinates
        this.updateBoundingBox();
        this._speed = this.speed.applyQuaternion(rotationQuaternion.inverse());

        // Angular rotation of the car
        const R: number = DEFAULT_WHEELBASE / Math.sin(this.steeringWheelDirection * deltaTime);
        const omega: number = this._speed.length() / R;
        this.mesh.rotateY(omega);
    }

    private physicsUpdate(deltaTime: number): void {
        this.rearWheel.angularVelocity += this.getAngularAcceleration() * deltaTime;
        this.engine.update(this._speed.length(), this.rearWheel.radius);
        this.weightRear = this.getWeightDistribution();
        this._speed.add(this.getDeltaSpeed(deltaTime));
        this._speed.setLength(this._speed.length() <= MINIMUM_SPEED ? 0 : this._speed.length());
        this.mesh.position.add(this.getDeltaPosition(deltaTime));
        this.rearWheel.update(this._speed.length());
    }

    private updateBoundingBox(): void {
        this.boundingBox.setFromObject(this.mesh);
    }

    private getWeightDistribution(): number {
        const acceleration: number = this.getAcceleration().length();
        /* tslint:disable:no-magic-numbers */
        const distribution: number =
            this.mass + (1 / this.wheelbase) * this.mass * acceleration / 2;

        return Math.min(Math.max(0.25, distribution), 0.75);
        /* tslint:enable:no-magic-numbers */
    }

    private getForces(): Vector3 {
        const resultingForce: Vector3 = new Vector3();

        if (this._speed.length() >= MINIMUM_SPEED) {
            const dragForce: Vector3 = this.getDragForce();
            const rollingResistance: Vector3 = this.getRollingResistance();
            const friction: Vector3 = this.getLatteralFrictionForce();
            resultingForce.add(dragForce).add(rollingResistance).add(friction);
        }

        if (this.isAcceleratorPressed) {
            const tractionForce: number = this.getTractionForce();
            const accelerationForce: Vector3 = this.direction;
            accelerationForce.multiplyScalar(tractionForce);
            resultingForce.add(accelerationForce);
        } else if (this.isBraking && this.isGoingForward()) {
            const brakeForce: Vector3 = this.getBrakeForce();
            resultingForce.add(brakeForce);
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

    private isGoingForward(): boolean {
        // tslint:disable-next-line:no-magic-numbers
        return this.speed.normalize().dot(this.direction) > 0.05;
    }
}
