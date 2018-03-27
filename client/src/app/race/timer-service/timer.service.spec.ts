import { TestBed, inject, async } from "@angular/core/testing";
import { TimerService } from "./timer.service";
import { Subscription } from "rxjs/Subscription";

describe("TimerService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TimerService]
        });
    });

    it("should be created", inject([TimerService], (service: TimerService) => {
        expect(service).toBeTruthy();
    }));

    it("should have a hundreth precision", async(inject([TimerService], (service: TimerService) => {
        const initialTime: number = new Date().getTime();
        const NBR_TEST: number = 3;
        let counter: number = 0;
        const subscription: Subscription = service.Time.subscribe((time: number) => {
            expect(time).toBeLessThanOrEqual(new Date().getTime() - initialTime + 1);
            expect(time).toBeGreaterThanOrEqual(new Date().getTime() - initialTime - 1);
            if (counter++ === NBR_TEST - 1) {
                subscription.unsubscribe();
            }
        });
    })));

    it("should have a second precision", async(inject([TimerService], (service: TimerService) => {
        const NBR_TEST: number = 3;
        let counter: number = 0;
        const subscription: Subscription = service.Seconds.subscribe((time: number) => {
            expect(time).toEqual(counter);
            if (counter++ === NBR_TEST - 1) {
                subscription.unsubscribe();
            }
        });
    })));

    it("should be based on the time of the machine", async(inject([TimerService], (service: TimerService) => {
        const initialTime: number = new Date().getTime();
        const SECONDS_IN_MS: number = 1000;
        const NBR_TEST: number = 3;
        let timeCounter: number = 0;
        let secondCounter: number = 0;

        const timeSubscription: Subscription = service.Time.subscribe((time: number) => {
            expect(time).toBeLessThanOrEqual(new Date().getTime() - initialTime + 1);
            expect(time).toBeGreaterThanOrEqual(new Date().getTime() - initialTime - 1);
            if (timeCounter++ === NBR_TEST - 1) {
                timeSubscription.unsubscribe();
            }
        });
        const secondsSubscription: Subscription = service.Seconds.subscribe((time: number) => {
            expect(time).toEqual(Math.round((new Date().getTime() - initialTime) / SECONDS_IN_MS) - 1);
            if (secondCounter++ === NBR_TEST - 1) {
                secondsSubscription.unsubscribe();
            }
        });
    })));
});
