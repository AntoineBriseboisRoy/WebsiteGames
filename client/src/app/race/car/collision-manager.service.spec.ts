import { TestBed, inject } from "@angular/core/testing";

import { CollisionManager } from "./collision-manager.service";
import { Car } from "./car";
import { Vector3 } from "three";
import { } from "jasmine";
import { LAP_NUMBER } from "../../constants";

// tslint:disable:no-magic-numbers
describe("CollisionManagerService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CollisionManager]
        });
    });

    it(
        "should be created",
        inject([CollisionManager], (service: CollisionManager) => {
            expect(service).toBeTruthy();
        })
    );

    it(
        "should have elastic collisions",
        inject([CollisionManager], async (service: CollisionManager) => {
            const carA: Car = new Car();
            const carB: Car = new Car();

            await carA.init();
            await carB.init();

            carA.speed = new Vector3(100, 100, 100);
            carB.speed = new Vector3(50, 50, 50);

            const initialSpeedA: Vector3 = service["getWorldCoordinatesSpeed"](carA);
            const initialSpeedB: Vector3 = service["getWorldCoordinatesSpeed"](carB);
            const initialSystemMomentum: Vector3 = initialSpeedA.multiplyScalar(carA.Mass).add(initialSpeedB.multiplyScalar(carB.Mass));

            service["carCollision"](carA, carB);

            const finalSpeedA: Vector3 = service["getWorldCoordinatesSpeed"](carA);
            const finalSpeedB: Vector3 = service["getWorldCoordinatesSpeed"](carB);
            const finalSystemMomentum: Vector3 = finalSpeedA.multiplyScalar(carA.Mass).add(finalSpeedB.multiplyScalar(carB.Mass));

            expect(finalSystemMomentum).toEqual(initialSystemMomentum);
        })
    );

    it(
        "should detect collisions",
        inject([CollisionManager], async (service: CollisionManager) => {
            const carA: Car = new Car();
            const carB: Car = new Car();

            await carA.init();
            await carB.init();
            const initialSpeedA: Vector3 = new Vector3(100, 100, 100);
            const initialSpeedB: Vector3 = new Vector3(50, 50, 50);

            carA.speed = initialSpeedA;
            carB.speed = initialSpeedB;

            service.addCar(carA);
            service.addCar(carB);

            service.update();

            expect(carA.speed).not.toEqual(initialSpeedA);
            expect(carB.speed).not.toEqual(initialSpeedB);
        })
    );

    // tslint:disable-next-line:max-func-body-length
    fit("should detect collisions", inject([CollisionManager], async (service: CollisionManager) => {
            const carA: Car = new Car();
            const carB: Car = new Car();

            await carA.init();
            await carB.init();

            service.addCar(carA);
            service.addCar(carB);

            service.update();

            carA.Information["checkpointInformation"]["isGoingForward"] = true;
            carA.Information["hasCrossedStartLineBackward"] = false;
            carA.Information["hasStartedAFirstLap"] = true;
            carA.Information["hasEndRace"] = false;

            carB.Information["checkpointInformation"]["isGoingForward"] = false;
            carB.Information["hasCrossedStartLineBackward"] = false;
            carB.Information["hasStartedAFirstLap"] = true;
            carB.Information["hasEndRace"] = false;

            carA.Information.completeALap();
            carA.Information.completeALap();
            carA.Information.completeALap();

            expect(carA.Information.Lap).toEqual(LAP_NUMBER);
            expect(carA.Information.HasEndRace).toBeTruthy();

            expect(carA.Information.Lap).toEqual(0);
            expect(carA.Information.HasEndRace).toBeFalsy();
        })
    );
});
