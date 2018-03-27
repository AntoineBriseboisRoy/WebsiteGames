import { TestBed, inject } from "@angular/core/testing";

import { RenderService } from "./render.service";
import { ITrack, TrackType } from "../../../../../common/interfaces/ITrack";
import { Point } from "../edit-track/Geometry";
import { CollisionManager } from "../car/collision-manager.service";
import { RoadCreator } from "./road-creator.service";

describe("RenderService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RenderService, CollisionManager, RoadCreator]
        });
    });

    it("should be created", inject([RenderService], (service: RenderService) => {
        expect(service).toBeTruthy();
    }));

    it("should have different textures for its floor and track", inject([RenderService], (service: RenderService) => {
        service.initialize(new HTMLDivElement(),
                           {name: "", description: "", points: new Array<Point>(), type: TrackType.REGULAR} as ITrack)
                           .catch((error: Error) => { console.error(error); });

        expect(service.RoadCreator.RoadTexture.sourceFile).not.toEqual(service.FloorTextures.get(TrackType.REGULAR).sourceFile);
    }));
});
