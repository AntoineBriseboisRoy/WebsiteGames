import { Injectable } from "@angular/core";
import { Audio, AudioLoader, AudioListener, AudioBuffer } from "three";
import { Car } from "./car/car";
import { COLLISION_SOUND_NAME, WALL_SOUND_NAME, ENGINE_SOUND_NAME } from "../constants";

const SOUNDS_PATH: string = "../assets/sounds/";
const SOUNDS_NAME: string[] = [COLLISION_SOUND_NAME, WALL_SOUND_NAME, ENGINE_SOUND_NAME];

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
        this.playLoop(ENGINE_SOUND_NAME);
    }

    private loadSounds(): void {
        SOUNDS_NAME.forEach((name: string) => {
            this.sounds.set(name, new Audio(this.listener));
            this.loader.load(SOUNDS_PATH + name,
                             (audioBuffer: AudioBuffer) => this.sounds.get(name).setBuffer(audioBuffer),
                             () => {/*DO NOTHING*/}, this.onError);
        });
    }

    public play(name: string): void {
        this.sounds.get(name).play();
    }

    private playLoop(name: string): void {
        this.play(name);
        this.sounds.get(name).setLoop(true);
    }

    public changeCarSoundSpeed(speed: number): void {
        this.sounds.get(ENGINE_SOUND_NAME).setPlaybackRate(speed);
    }

    private onError(error: Error): void {
        console.error(error);
    }
}
