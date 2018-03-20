import { AfterViewInit, Component, ElementRef, ViewChild, HostListener } from "@angular/core";
import { RenderService } from "../render-service/render.service";
import { Car } from "../car/car";
import { InputManagerService } from "../input-manager-service/input-manager.service";
import { CameraContext } from "../camera/camera-context";
import { DEFAULT_SHIFT_RPM } from "../car/engine";
import { TrackParserService } from "../track-parser.service";

const MAX_GEAR_BAR_WIDTH: number = 27;

@Component({
    moduleId: module.id,
    selector: "app-game-component",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.css"],
    providers: [
        RenderService,
        InputManagerService
    ]
})

export class GameComponent implements AfterViewInit {

    @ViewChild("container")
    private containerRef: ElementRef;

    public constructor(private renderService: RenderService, private inputManagerService: InputManagerService,
                       private trackParserService: TrackParserService) {
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
        this.renderService
            .initialize(this.containerRef.nativeElement, this.trackParserService.track)
            .then(/* do nothing */)
            .catch((err) => console.error(err));
        this.inputManagerService.init(this.car, this.CameraContext);
    }

    public get car(): Car {
        return this.renderService.car;
    }

    public get CameraContext(): CameraContext {
        return this.renderService.CameraContext;
    }

    public rpmRatio(): number {
        return (this.car.rpm / DEFAULT_SHIFT_RPM) * MAX_GEAR_BAR_WIDTH;
    }
}
