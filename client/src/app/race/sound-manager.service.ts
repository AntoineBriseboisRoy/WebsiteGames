import { Injectable } from "@angular/core";
import { Audio, AudioLoader, AudioListener, AudioBuffer } from "three";
import { Car } from "./car/car";

const SOUNDS_PATH: string = "../assets/sounds/";

@Injectable()
export class SoundManagerService {
    private sounds: Map<string, Audio>;
    private loader: AudioLoader;
    private listener: AudioListener;

    public get Listener(): AudioListener {
        return this.listener;
    }

    public constructor() {
        this.loader = new AudioLoader();
        this.listener = new AudioListener();
        this.sounds = new Map<string, Audio>();
        this.loadSounds();
    }

    public init(car: Car): void {
        car.add(this.listener);
    }

    private loadSounds(): void {
        const soundNames: string[] = ["countdown.ogg"];
        soundNames.forEach((name: string) => {
            this.sounds.set(name, new Audio(this.listener));
            this.loader.load(SOUNDS_PATH + name,
                             (audioBuffer: AudioBuffer) => {
                                this.sounds.get(name).setBuffer(audioBuffer);
                            },
                             this.onProgress, this.onError);
        });
    }

    public play(name: string): void {
        this.sounds.get(name).play();
    }

    private onProgress(xhr: XMLHttpRequest): void {
    }

    private onError(error: Error): void {
        console.error(error);
    }

}
