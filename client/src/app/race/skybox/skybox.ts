import { WebGLRenderer, Scene, AmbientLight,
    AxisHelper, Mesh, PlaneBufferGeometry, MeshBasicMaterial,
    DoubleSide, Texture, RepeatWrapping, TextureLoader, SphereGeometry,
     MeshPhongMaterial, ImageUtils, BackSide, log, CubeTexture, CubeTextureLoader } from "three";
import { Injectable } from "@angular/core";
import { PI_OVER_2 } from "../../constants";
const BACKGROUND_PATH: string = "../../../assets/camero/";

@Injectable()
export class Skybox {
    private scene: Scene;
    private cubeTexture: CubeTexture;
    public constructor() {
        this.cubeTexture = new CubeTextureLoader().setPath(BACKGROUND_PATH).load([
            "posx.jpg", "negx.jpg",
            "posy.jpg", "negy.jpg",
            "posz.jpg", "negz.jpg"
        ]);
    }
    public getCubeTexture(): CubeTexture {
        return this.cubeTexture;
    }
}
