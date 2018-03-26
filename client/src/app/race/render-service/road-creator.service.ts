import { Injectable } from "@angular/core";
import { Point } from "../edit-track/Geometry";
import { Texture, TextureLoader, RepeatWrapping, Vector3, Mesh, PlaneBufferGeometry,
         MeshBasicMaterial, BackSide, Vector2, CircleBufferGeometry } from "three";
import { HALF, PI_OVER_2 } from "../../constants";

const TEXTURE_TILE_REPETIONS: number = 200;
const WORLD_SIZE: number = 1000;
const ROAD_WIDTH: number = 10;
const SUPERPOSITION: number = 0.001;
@Injectable()
export class RoadCreator {

    private points: Point[];
    private meshes: Mesh[];
    private superposition: number;

    public get Meshes(): Mesh[] {
        return this.meshes;
    }
    public constructor() {
        this.points = new Array<Point>();
        this.meshes = new Array<Mesh>();
        this.superposition = 0;
    }
    public createTrack(points: Point[]): Mesh[] {
        this.points = points;
        for (let i: number = 0; i < this.points.length - 1; ++i) {
            this.createRoadSegment(i);
            this.createIntersection(i);
        }

        return this.meshes;
    }

    private createRoadSegment(index: number): void {
        const trackDirection: Vector3 = new Vector3(this.points[(index + 1) % this.points.length].x -
                                                    this.points[index].x,
                                                    0,
                                                    this.points[(index + 1) % this.points.length].y -
                                                    this.points[index].y);

        const trackTexture: Texture = new TextureLoader().load("/assets/road.jpg");
        trackTexture.wrapS = RepeatWrapping;
        trackTexture.repeat.set(trackDirection.length() * TEXTURE_TILE_REPETIONS, 1);

        const mesh: Mesh[] = new Array<Mesh>();
        const plane: PlaneBufferGeometry = new PlaneBufferGeometry(trackDirection.length() * WORLD_SIZE, ROAD_WIDTH);
        mesh.push(new Mesh(plane, new MeshBasicMaterial({ map: trackTexture, side: BackSide })));

        const meshPositionWorld: Vector2 = new Vector2(-(this.points[index].y + trackDirection.z * HALF)
                                                        * WORLD_SIZE + WORLD_SIZE * HALF,
                                                       -(this.points[index].x + trackDirection.x * HALF)
                                                        * WORLD_SIZE + WORLD_SIZE * HALF);

        this.createRoad(mesh[0], trackDirection, meshPositionWorld);
    }

    private createRoad(mesh: Mesh, trackDirection: Vector3, meshPositionWorld: Vector2): void {
        mesh.position.x = meshPositionWorld.x;
        mesh.position.z = meshPositionWorld.y;
        mesh.rotation.x = PI_OVER_2;
        mesh.rotation.z = trackDirection.z === 0 ? PI_OVER_2 : Math.atan(trackDirection.x / trackDirection.z);
        this.superpose(mesh);

        this.meshes.push(mesh);
    }

    private superpose(mesh: Mesh): void {
        this.superposition += SUPERPOSITION;
        mesh.position.y = this.superposition;
    }

    private createIntersection(index: number): void {
        const POLYGONS_NUMBER: number = 32;
        const trackTexture: Texture = new TextureLoader().load("/assets/road.jpg");
        const circle: CircleBufferGeometry = new CircleBufferGeometry(ROAD_WIDTH * HALF, POLYGONS_NUMBER);
        const mesh: Mesh = new Mesh(circle, new MeshBasicMaterial({ map: trackTexture, side: BackSide }));

        mesh.position.x = -(this.points[index].y) * WORLD_SIZE + WORLD_SIZE * HALF;
        mesh.position.z = -(this.points[index].x) * WORLD_SIZE + WORLD_SIZE * HALF;
        mesh.rotation.x = PI_OVER_2;
        this.superpose(mesh);

        this.meshes.push(mesh);
    }
}
