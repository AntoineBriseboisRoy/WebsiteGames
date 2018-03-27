import { TestBed, inject } from "@angular/core/testing";

import { MongoQueryService } from "./mongo-query.service";
import { Point } from "./race/edit-track/Geometry";
import { TrackType, ITrack } from "../../../common/interfaces/ITrack";
import { HttpClient, HttpHandler } from "@angular/common/http";

fdescribe("MongoQueryService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MongoQueryService, HttpClient, HttpHandler]
        });
    });

    it("should be created", inject([MongoQueryService], (service: MongoQueryService) => {
        expect(service).toBeTruthy();
    }));

    it("should add a track", inject([MongoQueryService], (service: MongoQueryService) => {
        const createdTrack: ITrack = {
            _id: "123",
            name: "LaTrack",
            description: "test",
            nTimesPlayed: 0,
            bestTimes: new Array<string>(),
            type: TrackType.REGULAR,
            points: Array<Point>()
        } as ITrack;
        service.postTrack(createdTrack).then(() => {
            service.getTrack("LaTrack").then((track: ITrack) => {
                expect(track).toEqual(createdTrack);
            });
        });
    }));

    it("should delete a track", inject([MongoQueryService], (service: MongoQueryService) => {
        const createdTrack: ITrack = {
            _id: "123",
            name: "test99",
            description: "test99",
            nTimesPlayed: 0,
            bestTimes: new Array<string>(),
            type: TrackType.REGULAR,
            points: Array<Point>()
        } as ITrack;
        service.postTrack(createdTrack).then(() => {
            service.deleteTrack("test99").then(() => {
                service.getTrack("test99").then((track: ITrack) => {
                    expect(track).not.toEqual(createdTrack);
                });
            });
        });
    }));

    it("should overwrite a track", inject([MongoQueryService], (service: MongoQueryService) => {
        const createdTrack: ITrack = {
            _id: "123",
            name: "test10",
            description: "test10",
            nTimesPlayed: 0,
            bestTimes: new Array<string>(),
            type: TrackType.REGULAR,
            points: Array<Point>()
        } as ITrack;
        const otherTrack: ITrack = {
            _id: "123",
            name: "test10",
            description: "autreDescription",
            nTimesPlayed: 0,
            bestTimes: new Array<string>(),
            type: TrackType.REGULAR,
            points: Array<Point>()
        } as ITrack;
        service.postTrack(createdTrack).then(() => {
            service.postTrack(otherTrack).then(() => {
                service.getTrack("test10").then((track: ITrack) => {
                    expect(track.description).toEqual(otherTrack.description);
                });
            });
        });
    }));
});
