import { WebGLRenderer, Scene, AmbientLight,
    AxisHelper, Mesh, PlaneBufferGeometry, MeshBasicMaterial,
    DoubleSide, Texture, RepeatWrapping, TextureLoader, SphereGeometry,
     MeshPhongMaterial, ImageUtils, BackSide, log, CubeTexture, CubeTextureLoader } from "three";
import { Injectable } from "@angular/core";
import {SKY_DAY, SKY_NIGHT} from "./skybox-uri/sky_uri";
import {WINTER_SCENERY} from "./skybox-uri/winter_uri";
import {SUMMER_SCENERY} from "./skybox-uri/summer_uri";
import {SPRING_SCENERY} from "./skybox-uri/spring_uri";
import {AUTUMN_SCENERY} from "./skybox-uri/autumn_uri";
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
// enum DayPeriod {
//     Night = 0,
//     Day = 1
// }

// const N_POLY: number = 100;

// @Injectable()
// export class Skybox {

//     private geometry: SphereGeometry;
//     private material: MeshPhongMaterial;
//     private texture: Texture;
//     private sky: Mesh;

//     public constructor(private dayPeriod: DayPeriod = DayPeriod.Night, radius: number) {
//         this.geometry = new SphereGeometry(radius, N_POLY, N_POLY);
//         this.texture = new TextureLoader().load(this.dayPeriod === DayPeriod.Day ? SKY_DAY : SPRING_SCENERY);
//         this.material = new MeshPhongMaterial({map: this.texture, side: DoubleSide});
//         this.sky = new Mesh(this.geometry, this.material);
//         this.sky.rotation.y = PI_OVER_2;
//     }

//     public get Sky(): Mesh {
//         return this.sky;
//     }

//     public toggleDayPeriod(): void {
//         this.dayPeriod = (this.dayPeriod === DayPeriod.Day ? DayPeriod.Night : DayPeriod.Day);

//         this.texture = new TextureLoader().load(this.dayPeriod === DayPeriod.Day ? SKY_DAY : SPRING_SCENERY);
//         this.material = new MeshPhongMaterial({map: this.texture, side: DoubleSide});
//         this.sky = new Mesh(this.geometry, this.material);
//     }
