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
import { DayPeriodContext } from "../dayToggle-context";
import { DateFormatter } from "../date-formatter";
import { LAP_NUMBER } from "../../constants";
import { RankingService } from "../ranking.service";

const MAX_GEAR_BAR_WIDTH: number = 27;

@Component({
    moduleId: module.id,
    selector: "app-game-component",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.css"],
    providers: [
        TimerService,
        RankingService
    ]
})

export class GameComponent implements AfterViewInit {

    @ViewChild("container")
    private containerRef: ElementRef;
    public startingText: string;
    public bestTime: Date;
    public lapNumber: number;

    public constructor(private renderService: RenderService, private inputManagerService: InputManagerService,
                       private mongoQueryService: MongoQueryService , private route: ActivatedRoute, private timer: TimerService,
                       private rankingService: RankingService) {
        this.containerRef = undefined;
        this.startingText = "";
        this.bestTime = new Date(0, 0, 0, 0, 0, 0, 0);
        this.lapNumber = LAP_NUMBER;
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
                this.renderService.initialize(this.containerRef.nativeElement, track)
                .then((data) => {
                    this.startingSequence();
                    this.rankingService.initializeRanking(this.renderService.Cars);
                })
                .catch((err) => console.error(err));
                this.bestTime = new Date(track.bestTimes[0].time);
            }).catch((error: Error) => {
                console.error(error);
            });
        });
    }

    public get player(): Car {
        return this.renderService.Cars[0];
    }

    public get CameraContext(): CameraContext {
        return this.renderService.CameraContext;
    }

    public get DayPeriodContext(): DayPeriodContext {
        return this.renderService.DayPeriodContext;
    }

    public get BestTime(): string {
        return DateFormatter.DateToMinSecMillisec(new Date(this.bestTime));
    }

    public rpmRatio(): number {
        return (this.player.rpm / DEFAULT_SHIFT_RPM) * MAX_GEAR_BAR_WIDTH;
    }

    private startingSequence(): void {
        const COUNTDOWN: number = 3;
        const startingSequence: HTMLAudioElement = new Audio();
        startingSequence.src = "../../../assets/sounds/countdown.ogg";
        startingSequence.load();
        let countdown: number = COUNTDOWN;
        const subscription: Subscription = this.timer.Seconds.subscribe((time: number) => {
            if (countdown === COUNTDOWN) {
                startingSequence.play().catch((error: Error) => console.error(error));
            }
            if (countdown > 0) {
                this.startingText = (countdown).toString();
            } else if (countdown > -1) {
                this.inputManagerService.init(this.player, this.CameraContext, this.DayPeriodContext);
                this.timer.initialize();
                this.renderService.initializeAI();
                this.startTimers();
                this.startingText = "Start!";
            }
            if (countdown-- < -1) {
                this.startingText = "";
                subscription.unsubscribe();
            }
        });
    }

    private startTimers(): void {
        for (const car of this.renderService.Cars) {
            const subscription: Subscription = this.timer.Time.subscribe((time: number) => {
                car.Information.startTimer(subscription);
                car.Information.TotalTime.setTime(time);
            });
        }
    }
}
