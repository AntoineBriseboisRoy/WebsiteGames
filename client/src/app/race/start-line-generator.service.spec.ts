import { TestBed, inject } from "@angular/core/testing";

import { StartLineGeneratorService } from "./start-line-generator.service";
import { Car } from "./car/car";

fdescribe("StartLineGeneratorService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [StartLineGeneratorService]
        });
    });

    it("should be created", inject([StartLineGeneratorService], (service: StartLineGeneratorService) => {
        expect(service).toBeTruthy();
    }));

    it("should be shuffled", inject([StartLineGeneratorService], (service: StartLineGeneratorService) => {
        const NUMBER_OF_CARS: number = 4;
        const cars: Array<Car> = new Array<Car>();
        for (let i: number = 0; i < NUMBER_OF_CARS; i++ ) {
            cars.push(new Car());
        }
        const noneShuffledCars: Array<Car> = cars.splice(0);
        service["shuffleCars"](cars);
        for (let i: number = 0; i < NUMBER_OF_CARS; i++ ) {
            expect(cars[i]).not.toEqual(noneShuffledCars[i]);
        }
    }));
});
