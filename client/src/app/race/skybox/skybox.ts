import { CubeTexture, CubeTextureLoader } from "three";
import { Injectable } from "@angular/core";

export enum DayPeriod {
    NIGHT = "night/",
    DAY = "day/"
}

const BACKGROUND_PATH: string = "../../../assets/camero/";

@Injectable()
export class Skybox {
    private cubeTexture: CubeTexture;

    public constructor(period: DayPeriod) {
        this.cubeTexture = new CubeTextureLoader().setPath(BACKGROUND_PATH + period).load([
            "posx.jpg", "negx.jpg",
            "posy.jpg", "negy.jpg",
            "posz.jpg", "negz.jpg"
        ]);
    }

    public get CubeTexture(): CubeTexture {
        return this.cubeTexture;
    }
}
