import { AfterViewInit, Component, ElementRef, ViewChild, HostListener } from "@angular/core";
import { RenderService } from "../render-service/render.service";
import { Car } from "../car/car";
import { InputManagerService } from "../input-manager-service/input-manager.service";
import { CameraContext } from "../camera/camera-context";
import { DEFAULT_SHIFT_RPM } from "../car/engine";
import { ITrack } from "../../../../../common/interfaces/ITrack";
import { ActivatedRoute, Params } from "@angular/router";
import { MongoQueryService } from "../../mongo-query.service";
import { TimerService } from "../timer-service/timer.service";
import { Subscription } from "rxjs/Subscription";

const MAX_GEAR_BAR_WIDTH: number = 27;

@Component({
    moduleId: module.id,
    selector: "app-game-component",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.css"],
    providers: [
        RenderService,
        InputManagerService,
        TimerService
    ]
})

export class GameComponent implements AfterViewInit {

    @ViewChild("container")
    private containerRef: ElementRef;

    public startingText: string;

    public constructor(private renderService: RenderService, private inputManagerService: InputManagerService,
                       private mongoQueryService: MongoQueryService , private route: ActivatedRoute, private timer: TimerService) {
        this.containerRef = undefined;
        this.startingText = "";
    }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.renderService.onResize();
    }

    @HostListener("window:keydown", ["$event"])
    public onKeyDown(event: KeyboardEvent): void {
        this.inputManagerService.handleKeyDown(event.keyCode);
    }

    @HostListener("window:keyup", ["$event"])
    public onKeyUp(event: KeyboardEvent): void {
        this.inputManagerService.handleKeyUp(event.keyCode);
    }

    public ngAfterViewInit(): void {
        this.route.queryParams.subscribe((params: Params) => {
            this.mongoQueryService.getTrack(params["name"]).then((track: ITrack) => {
                this.renderService
                .initialize(this.containerRef.nativeElement, track)
                .then((data) => {
                    this.startupSequence();
                })
                .catch((err) => console.error(err));
                this.inputManagerService.init(this.car, this.CameraContext);
            });
        });
    }

    public get car(): Car {
        return this.renderService.car;
    }

    public get CameraContext(): CameraContext {
        return this.renderService.CameraContext;
    }

    private startupSequence(): void {
        // Bloquer contrôles de la voiture
        let counter: number = 4;
        const subscription: Subscription = this.timer.getTime().subscribe((time: Date) => {
            this.startingText = counter > 1 ? (counter - 1).toString() : "Start!";
            if (counter-- < 1) {
                this.startingText = "";
                subscription.unsubscribe();
            }
        });
        // Débloquer contrôles de la voiture
    }
    public rpmRatio(): number {
        return (this.car.rpm / DEFAULT_SHIFT_RPM) * MAX_GEAR_BAR_WIDTH;
    }
}
