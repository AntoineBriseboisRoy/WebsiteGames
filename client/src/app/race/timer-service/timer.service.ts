import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/interval";
import "rxjs/add/operator/map";
import "rxjs/add/operator/share";

export const SECOND: number = 1000;
export const TEN_MS: number = 10;

@Injectable()
export class TimerService {
    private time: Observable<number>;
    private seconds: Observable<number>;
    private startDate: Date;

    public constructor() {
        this.startDate = new Date();
        this.time = Observable
        .interval(TEN_MS)
        .map((time: number) => (new Date().getTime() - this.startDate.getTime()))
        .share();

        this.seconds = Observable
        .interval(SECOND)
        .share();
    }

    public initialize(): void {
        this.startDate = new Date();
    }

    public get Time(): Observable<number> {
        return this.time;
    }

    public get Seconds(): Observable<number> {
        return this.seconds;
    }
}
