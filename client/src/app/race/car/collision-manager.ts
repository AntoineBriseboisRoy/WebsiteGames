import { Car } from "./car";
import { Object3D } from "three";

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
    }

    private collision(carA: Car, carB: Car): void {
        // Find which raycaster detected the collision
        // Calculate the physics for the collision as a whole (total energy, etc.)
        // Apply physics to each car
    }
}
