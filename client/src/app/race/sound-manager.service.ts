import { Injectable } from "@angular/core";
import { Audio, AudioLoader, AudioListener, AudioBuffer } from "three";

const SOUNDS_PATH: string = "../assets/sounds/";

@Injectable()
export class SoundManagerService {
    private sound: Audio;
    private loader: AudioLoader;
    private listener: AudioListener;

    public constructor() {
        this.loader = new AudioLoader();
        this.listener = new AudioListener();
        this.sound = new Audio(this.listener);
    }

    public play(name: string): void {
        this.sound = new Audio(this.listener);
        this.loader.load(SOUNDS_PATH + name, this.onLoad, this.onProgress, this.onError);
    }

    private onLoad(audioBuffer: AudioBuffer): void {
        this.sound.setBuffer(audioBuffer);
        this.sound.play();
    }

    private onProgress(xhr: XMLHttpRequest): void {
    }

    private onError(error: Error): void {
        console.error(error);
    }

}
