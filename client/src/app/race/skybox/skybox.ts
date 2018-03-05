import { CubeTexture, CubeTextureLoader } from "three";
import { Injectable } from "@angular/core";

const BACKGROUND_PATH: string = "../../../assets/camero/";

@Injectable()
export class Skybox {
    private cubeTexture: CubeTexture;

    public constructor() {
        this.cubeTexture = new CubeTextureLoader().setPath(BACKGROUND_PATH).load([
            "posx.jpg", "negx.jpg",
            "posy.jpg", "negy.jpg",
            "posz.jpg", "negz.jpg"
        ]);
    }

    public get CubeTexture(): CubeTexture {
        return this.cubeTexture;
    }
}
