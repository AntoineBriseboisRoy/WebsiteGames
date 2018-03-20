import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/interval";
import "rxjs/add/operator/map";
import "rxjs/add/operator/share";

const TIMER_INTERVAL: number = 1000;

@Injectable()
export class TimerService {
    private timer: Observable<Date>;

    public constructor() {
        this.timer = Observable
        .interval(TIMER_INTERVAL)
        .map((time: number) => new Date())
        .share();
    }

    public getTime(): Observable<Date> {
        return this.timer;
    }
}
