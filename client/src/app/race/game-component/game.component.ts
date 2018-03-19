import { AfterViewInit, Component, ElementRef, ViewChild, HostListener } from "@angular/core";
import { RenderService } from "../render-service/render.service";
import { Car } from "../car/car";
import { InputManagerService } from "../input-manager-service/input-manager.service";
import { CameraContext } from "../camera/camera-context";
import { Point } from "../edit-track/Geometry";
import { DEFAULT_SHIFT_RPM } from "../car/engine";

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

    public constructor(private renderService: RenderService, private inputManagerService: InputManagerService) {
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
        // TODO: Mettre le GET des points de la track a load ici
        const mockPoints: Point[] = [{ x: 0.5, y: 0.5, start: true, end: false},
                                     { x: 0.6, y: 0.6, start: false, end: false},
                                     { x: 0.6, y: 0.5, start: false, end: false},
                                     { x: 0.5, y: 0.5, start: false, end: true}];

        this.renderService
            .initialize(this.containerRef.nativeElement, mockPoints)
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
