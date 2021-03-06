import { async, ComponentFixture, TestBed, inject } from "@angular/core/testing";

import { AdminSectionComponent } from "./admin-section.component";
import { RouterModule, Router } from "@angular/router";
import { MongoQueryService } from "../mongo-query.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ITrack, TrackType, IBestTime } from "../../../../common/interfaces/ITrack";
import { Point } from "../race/edit-track/Geometry";
import { expect } from "chai";

describe("AdminSectionComponent", () => {
    let component: AdminSectionComponent;
    let fixture: ComponentFixture<AdminSectionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AdminSectionComponent],
            imports: [RouterModule, HttpClientModule],
            providers: [MongoQueryService, HttpClient, Router]
        })
            .compileComponents().catch((error: Error) => {
                console.error(error);
            });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminSectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should delete from MongoDB properly", inject([MongoQueryService], (mongoQueryService: MongoQueryService)  => {
        const createdTrack: ITrack = { _id: "123",
                                       name: "test",
                                       description: "test",
                                       nTimesPlayed: 0,
                                       bestTimes: new Array<IBestTime>(),
                                       type: TrackType.REGULAR,
                                       points: Array<Point>() } as ITrack;

        mongoQueryService.putTrack("test", createdTrack).then(() => {
            component.deleteTrack("test");
            component["getITracksFromServer"]();
            component.tracks.forEach((track: ITrack) => {
                expect(track).not.equal(createdTrack);
            });
        }).catch((error: Error) => console.error(error));
    }));

    it("should correctly get tracks from the server", inject([MongoQueryService], (mongoQueryService: MongoQueryService) => {
        component["getITracksFromServer"]();

        expect(component.tracks.length).not.equal(0);
    }));
});
