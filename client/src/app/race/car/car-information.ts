export class CarInformation {
    public lap: number;
    public totalTime: Date;
    public lapTime: Date;
    public constructor() {
        this.lap = 0;
        this.totalTime = new Date(0);
        this.lapTime = new Date(0);
    }
}
