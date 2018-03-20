import { TestBed, inject } from "@angular/core/testing";

import { TrackParserService } from "./track-parser.service";

describe("TrackParserService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TrackParserService]
        });
    });

    it("should be created", inject([TrackParserService], (service: TrackParserService) => {
        expect(service).toBeTruthy();
    }));
});
