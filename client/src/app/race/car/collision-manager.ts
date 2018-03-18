import { Car } from "./car";
import { Object3D, Vector3, Matrix4, Quaternion } from "three";

export class CollisionManager {

    private cars: Car[];
    private collisionables: Object3D[]; // In the optic that cars, walls and different floor types can create collisions.

    public constructor() {
        this.cars = new Array<Car>();
        this.collisionables = new Array<Object3D>();
    }

    public addCar(car: Car): void {
        this.cars.push(car);
        this.addCollisionable(car);
    }

    public addCollisionable(collisionable: Object3D): void {
        this.collisionables.push(collisionable);
    }

    public update(): void {
        this.verifyCollision();
    }

    private verifyCollision(): void {
        if (this.cars[0].BoundingBox.intersectsBox(this.cars[1].BoundingBox)) {
            this.collision(this.cars[0], this.cars[1]);
        }
    }

    // tslint:disable-next-line:max-func-body-length
    private collision(carA: Car, carB: Car): void {
        const massA: number = carA.Mass;
        const massB: number = carB.Mass;
        const speedA: Vector3 = carA.speed;
        const speedB: Vector3 = carB.speed;

        const rotationA: Matrix4 = new Matrix4();
        rotationA.extractRotation(carA.getMeshMatrix());
        const rotationQuaternionA: Quaternion = new Quaternion();
        rotationQuaternionA.setFromRotationMatrix(rotationA);
        speedA.applyMatrix4(rotationA);

        const rotationB: Matrix4 = new Matrix4();
        rotationB.extractRotation(carB.getMeshMatrix());
        const rotationQuaternionB: Quaternion = new Quaternion();
        rotationQuaternionB.setFromRotationMatrix(rotationB);
        speedB.applyMatrix4(rotationB);

        const totalSystemMomentum: Vector3 = speedA.multiplyScalar(massA).add(speedB.multiplyScalar(massB));

        let carANewSpeed: Vector3 = new Vector3(totalSystemMomentum.x / massA / 2,
                                                totalSystemMomentum.y / massA / 2,
                                                totalSystemMomentum.z / massA / 2);
        let carBNewSpeed: Vector3 = new Vector3(totalSystemMomentum.x / massB / 1.95,
                                                totalSystemMomentum.y / massB / 1.95,
                                                totalSystemMomentum.z / massB / 1.95);

        carANewSpeed = carANewSpeed.applyQuaternion(rotationQuaternionA.inverse());
        carBNewSpeed = carBNewSpeed.applyQuaternion(rotationQuaternionB.inverse());

        carA.speed = carANewSpeed;

        carB.speed = carBNewSpeed;
    }
}
