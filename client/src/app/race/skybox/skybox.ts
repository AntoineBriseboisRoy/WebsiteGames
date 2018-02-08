import { WebGLRenderer, Scene, AmbientLight,
    AxisHelper, Mesh, PlaneBufferGeometry, MeshBasicMaterial,
    DoubleSide, Texture, RepeatWrapping, TextureLoader, SphereGeometry, MeshPhongMaterial, ImageUtils, BackSide, log } from "three";
import { Injectable } from "@angular/core";
import { SKY_DAY, SKY_NIGHT } from "./sky_uri";
import { PI_OVER_2 } from "../../constants";

enum DayPeriod {
    Night = 0,
    Day = 1
}

const N_POLY: number = 16;

@Injectable()
export class Skybox {

    private geometry: SphereGeometry;
    private material: MeshPhongMaterial;
    private texture: Texture;
    private sky: Mesh;

    public constructor(private dayPeriod: DayPeriod, radius: number) {
        this.geometry = new SphereGeometry(radius, N_POLY, N_POLY);
        this.texture = new TextureLoader().load(this.dayPeriod === DayPeriod.Day ? SKY_DAY : SKY_NIGHT);
        this.material = new MeshPhongMaterial({map: this.texture, side: DoubleSide});
        this.sky = new Mesh(this.geometry, this.material);
    }

    public get Sky(): Mesh {
        return this.sky;
    }

    public toggleDayPeriod(): void {
        this.dayPeriod = (this.dayPeriod === DayPeriod.Day ? DayPeriod.Night : DayPeriod.Day);

        this.texture = new TextureLoader().load(this.dayPeriod === DayPeriod.Day ? SKY_DAY : SKY_NIGHT);
        this.material = new MeshPhongMaterial({map: this.texture, side: DoubleSide});
        this.sky = new Mesh(this.geometry, this.material);
    }
}
