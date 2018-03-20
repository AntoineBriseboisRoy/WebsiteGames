import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/interval";
import "rxjs/add/operator/map";
import "rxjs/add/operator/share";

export const SECOND: number = 1000;
export const TEN_MILLISECONDS: number = 10;

@Injectable()
export class TimerService {
    private seconds: Observable<Date>;
    private hundredth: Observable<Date>;

    public constructor() {
        this.seconds = Observable
        .interval(SECOND)
        .map((time: number) => new Date())
        .share();

        this.hundredth = Observable
        .interval(TEN_MILLISECONDS)
        .map((time: number) => new Date())
        .share();
    }

    public getTimeSecond(): Observable<Date> {
        return this.seconds;
    }

    public getHundredthSecond(): Observable<Date> {
        return this.hundredth;
    }
}
