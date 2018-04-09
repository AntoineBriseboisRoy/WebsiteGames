export class CarInformation {
    private lap: number;
    public totalTime: Date;
    public lapTime: Date;
    private hasStartedAFirstLap: boolean;
    public constructor() {
        this.lap = 0;
        this.totalTime = new Date(0);
        this.lapTime = new Date(0);
        this.hasStartedAFirstLap = false;
    }

    public get Lap(): number {
        return this.lap;
    }

    public incrementLap(): void {
        if (this.hasStartedAFirstLap) {
            this.lap++;
        } else {
            this.hasStartedAFirstLap = true;
        }
    }
}
