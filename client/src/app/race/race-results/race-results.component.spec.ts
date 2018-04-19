import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RaceResultsComponent } from "./race-results.component";
import { CarInformation } from "../car/car-information";
import { RenderService } from "../render-service/render.service";
import { MongoQueryService } from "../../mongo-query.service";
import { FormsModule } from "@angular/forms";
import { CollisionManager } from "../car/collision-manager.service";
import { SoundManagerService } from "../sound-manager.service";
import { ModalService } from "../../modal/modal.service";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ModalStateService } from "../../modal/modal-state.service";
import { NgbModalStack } from "@ng-bootstrap/ng-bootstrap/modal/modal-stack";
import { APP_BASE_HREF } from "@angular/common";
import { InputManagerService } from "../input-manager-service/input-manager.service";
import { RoadCreator } from "../render-service/road-creator.service";
import { StartLineGeneratorService } from "../start-line-generator.service";
import { RouterTestingModule } from "@angular/router/testing";
import { Routes } from "@angular/router";
import { IBestTime } from "../../../../../common/interfaces/ITrack";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Vector2 } from "three";
import { LAP_NUMBER } from "../../constants";

const routes: Routes = [
    {path: "", redirectTo: "home", pathMatch: "full"}
  ];
class FakeMongoService {
    public BASE_URL: string = `bidon`;
    public trackBestTimes: IBestTime[];

    public getTrackBestTimes = (): void => {
        this.trackBestTimes = [
            { playerName: "ad", time: new Date()}
        ];
    }
}
// tslint:disable:no-magic-numbers
describe("RaceResultsComponent", () => {
    const wantedName: string = "NYAN";
    let component: RaceResultsComponent;
    let fixture: ComponentFixture<RaceResultsComponent>;
    let carInformation: CarInformation;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, NgbModule, HttpClientTestingModule, RouterTestingModule.withRoutes(routes)],
            declarations: [RaceResultsComponent],
            providers: [RenderService, {provide: MongoQueryService, useClass: FakeMongoService}, CollisionManager, SoundManagerService,
                        ModalService, ModalStateService, NgbModalStack, {provide: APP_BASE_HREF, useValue: "/"},
                        InputManagerService, RoadCreator, StartLineGeneratorService]
        }).compileComponents().catch((error: Error) => console.error(error));
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RaceResultsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        carInformation = new CarInformation();
        component.CarInformations.push(carInformation);
        component.TrackBestTimes.push(
            { playerName: "[Anonymous Player]", time: new Date("1970-01-01T00:00:02.875Z") },
            { playerName: "Test", time: new Date("1970-01-01T00:00:03.216Z") },
            { playerName: "Antoine", time: new Date("1970-01-01T00:00:04.982Z") },
            { playerName: "Antoine", time: new Date("1970-01-01T00:00:04.982Z") },
            { playerName: "[Anonymous Player]", time: new Date("1970-01-01T00:00:07.783Z") });
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    // Tableau des meilleurs temps
    it("should let the user enter his name if he has won and has a good time", () => {
        component.CarInformations[0]["ranking"] = 1;
        component.CarInformations[0].TotalTime = new Date();

        if (component["inBestTimes"]() && component.CarInformations[0].Ranking === 1) {
            component.CarInformations[0]["playerName"] = wantedName;
        }
        expect(wantedName).toEqual(component.CarInformations[0].playerName);
    });

    it("should not let the user enter his name if he has not won but has a good time", () => {
        component.CarInformations[0]["ranking"] = 2;
        component.CarInformations[0].TotalTime = new Date();

        if (component["inBestTimes"]() && component.CarInformations[0].Ranking === 1) {
            component.CarInformations[0]["playerName"] = wantedName;
        }
        expect(wantedName).not.toEqual(component.CarInformations[0].playerName);
    });

    it("should not let the user enter his name if he has won and but a bad time", () => {
        component.CarInformations[0]["ranking"] = 1;
        component.CarInformations[0].TotalTime = new Date("1970-01-01T00:00:17.783Z"); // Ten seconds more than fifth best time

        if (component["inBestTimes"]() && component.CarInformations[0].Ranking === 1) {
            component.CarInformations[0]["playerName"] = wantedName;
        }
        expect(wantedName).not.toEqual(component.CarInformations[0].playerName);
    });
    // -------

    // Résultats d'une course
    it("show the players in their finishing order", () => {
        for (let i: number = 0; i < 2; i++) {
            component.CarInformations.push(new CarInformation());
        }

        component.CarInformations[0]["playerName"] = "John";
        component.CarInformations[0].TotalTime = new Date("1970-01-01T00:00:17.783Z");
        component.CarInformations[1]["playerName"] = "Bob";
        component.CarInformations[1].TotalTime = new Date("1970-01-01T00:00:07.783Z");
        component.CarInformations[2]["playerName"] = "Alice";
        component.CarInformations[2].TotalTime = new Date("1970-01-01T00:00:27.783Z");

        component["sortRaceTimes"]();

        expect(component.CarInformations[0].playerName).toEqual("Bob");
        expect(component.CarInformations[1].playerName).toEqual("John");
        expect(component.CarInformations[2].playerName).toEqual("Alice");

    });
    // -------

    // tslint:disable-next-line:max-func-body-length
    it("should simulates a lap time for every incompleted lap", () => {
        for (let i: number = 0; i < 1; i++) {
            component.CarInformations.push(new CarInformation());
        }

        const commonTime: Date = new Date("1970-01-01T00:00:17.783Z");

        component.CarInformations[0]["playerName"] = "John";
        component.CarInformations[0].TotalTime = commonTime;
        component.CarInformations[0].LapTimes.push(new Date("1970-01-01T00:00:6.927Z"));
        component.CarInformations[0].LapTimes.push(new Date("1970-01-01T00:00:4.927Z"));
        component.CarInformations[0].LapTimes.push(new Date("1970-01-01T00:00:5.927Z"));
        component.CarInformations[0]["hasEndRace"] = true;
        component.CarInformations[0]["checkpointInformation"]["checkpointCounter"] = 14;
        for (let i: number = 0; i < 20; i++ ) {
            component.CarInformations[0]["checkpointInformation"]["checkpoints"].push([new Vector2(), new Vector2()]);
        }

        component.CarInformations[1]["playerName"] = "Bob";
        component.CarInformations[1].TotalTime = commonTime;
        component.CarInformations[1].LapTimes.push(new Date("1970-01-01T00:00:6.927Z"));
        component.CarInformations[1]["hasEndRace"] = false;
        component.CarInformations[0]["checkpointInformation"]["checkpointCounter"] = 14;
        for (let i: number = 0; i < 20; i++ ) {
            component.CarInformations[0]["checkpointInformation"]["checkpoints"].push([new Vector2(), new Vector2()]);
        }

        component["simulateTimes"]();

        expect(component.CarInformations[0].LapTimes.length).toEqual(LAP_NUMBER);
        expect(component.CarInformations[1].LapTimes.length).toEqual(LAP_NUMBER);
        expect(component.CarInformations[1].LapTimes[1].getTime()).not.toEqual(0);
        expect(component.CarInformations[1].LapTimes[2].getTime()).not.toEqual(0);
    });

    // tslint:disable-next-line:max-func-body-length
    it("should simulates random but realistic lap times", () => {
        for (let i: number = 0; i < 1; i++) {
            component.CarInformations.push(new CarInformation());
        }

        const commonTime: Date = new Date("1970-01-01T00:00:17.783Z");

        component.CarInformations[0]["playerName"] = "John";
        component.CarInformations[0].TotalTime = commonTime;
        component.CarInformations[0].LapTimes.push(new Date("1970-01-01T00:00:6.927Z"));
        component.CarInformations[0].LapTimes.push(new Date("1970-01-01T00:00:4.927Z"));
        component.CarInformations[0].LapTimes.push(new Date("1970-01-01T00:00:5.927Z"));
        component.CarInformations[0]["hasEndRace"] = true;
        component.CarInformations[0]["checkpointInformation"]["checkpointCounter"] = 14;
        for (let i: number = 0; i < 20; i++ ) {
            component.CarInformations[0]["checkpointInformation"]["checkpoints"].push([new Vector2(), new Vector2()]);
        }

        component.CarInformations[1]["playerName"] = "Bob";
        component.CarInformations[1].TotalTime = commonTime;
        component.CarInformations[1].LapTimes.push(new Date("1970-01-01T00:00:6.927Z"));
        component.CarInformations[1]["hasEndRace"] = false;
        component.CarInformations[0]["checkpointInformation"]["checkpointCounter"] = 14;
        for (let i: number = 0; i < 20; i++ ) {
            component.CarInformations[0]["checkpointInformation"]["checkpoints"].push([new Vector2(), new Vector2()]);
        }

        component["simulateTimes"]();

        expect(component.CarInformations[1].LapTimes[1].getTime()).not.toEqual(component.CarInformations[1].LapTimes[2].getTime());
        expect(component.CarInformations[1].LapTimes[1].getTime() < component.CarInformations[1].LapTimes[2].getTime() * 1.21 ||
               component.CarInformations[1].LapTimes[1].getTime() > component.CarInformations[1].LapTimes[2].getTime() * -1.21);
    });

    // tslint:disable-next-line:max-func-body-length
    it("should simulates total time properly", () => {
        for (let i: number = 0; i < 1; i++) {
            component.CarInformations.push(new CarInformation());
        }

        const commonTime: Date = new Date("1970-01-01T00:00:17.783Z");

        component.CarInformations[0]["playerName"] = "John";
        component.CarInformations[0].TotalTime = commonTime;
        component.CarInformations[0].LapTimes.push(new Date("1970-01-01T00:00:6.927Z"));
        component.CarInformations[0].LapTimes.push(new Date("1970-01-01T00:00:4.927Z"));
        component.CarInformations[0].LapTimes.push(new Date("1970-01-01T00:00:5.927Z"));
        component.CarInformations[0]["hasEndRace"] = true;
        component.CarInformations[0]["checkpointInformation"]["checkpointCounter"] = 14;
        for (let i: number = 0; i < 20; i++ ) {
            component.CarInformations[0]["checkpointInformation"]["checkpoints"].push([new Vector2(), new Vector2()]);
        }

        component.CarInformations[1]["playerName"] = "Bob";
        component.CarInformations[1].TotalTime = commonTime;
        component.CarInformations[1].LapTimes.push(new Date("1970-01-01T00:00:6.927Z"));
        component.CarInformations[1]["hasEndRace"] = false;
        component.CarInformations[0]["checkpointInformation"]["checkpointCounter"] = 14;
        for (let i: number = 0; i < 20; i++ ) {
            component.CarInformations[0]["checkpointInformation"]["checkpoints"].push([new Vector2(), new Vector2()]);
        }

        component["simulateTimes"]();

        expect(component.CarInformations[0].TotalTime).toEqual(component.CarInformations[0].LapTimes.reduce((a, b) => a + b.getTime(), 0));
        expect(component.CarInformations[1].TotalTime).toEqual(component.CarInformations[1].LapTimes.reduce((a, b) => a + b.getTime(), 0));
    });
});
