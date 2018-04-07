import { CubeTexture, CubeTextureLoader } from "three";
import { Injectable } from "@angular/core";

export enum DayPeriod {
    NIGHT = "night/",
    DAY = "day/"
}

const BACKGROUND_PATH: string = "../../../assets/camero/";

@Injectable()
export class Skybox {
    private skyboxCube: CubeTexture;

    public constructor(period: DayPeriod) {
        this.skyboxCube = new CubeTextureLoader().setPath(BACKGROUND_PATH + period).load([
            "right.png", "left.png",
            "top.png", "bottom.png",
            "back.png", "front.png"
        ]);
    }

    public get SkyboxCube(): CubeTexture {
        return this.skyboxCube;
    }
}
