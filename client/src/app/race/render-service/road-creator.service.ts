import { Injectable } from "@angular/core";
import { Point } from "../edit-track/Geometry";
import { Texture, TextureLoader, RepeatWrapping, Vector3, Mesh, PlaneBufferGeometry,
         BackSide, Vector2, CircleBufferGeometry, MeshPhongMaterial } from "three";
import { HALF, PI_OVER_2 } from "../../constants";

const TEXTURE_TILE_REPETIONS: number = 200;
const WORLD_SIZE: number = 1000;
const ROAD_WIDTH: number = 20;
const SUPERPOSITION: number = 0.001;
const ROAD_TEXTURE_PATH: string = "/assets/uniformRoad.jpg";
@Injectable()
export class RoadCreator {

    private points: Point[];
    private trackMeshes: Mesh[];
    private superposition: number;
    private roadTexture: Texture;

    public get Meshes(): Mesh[] {
        return this.trackMeshes;
    }

    public get RoadTexture(): Texture {
        return this.roadTexture;
    }

    public constructor() {
        this.points = new Array<Point>();
        this.trackMeshes = new Array<Mesh>();
        this.superposition = 0;
        this.roadTexture = this.loadTexture(ROAD_TEXTURE_PATH);
    }

    public createTrack(points: Point[]): void {
        this.points = points;
        for (let i: number = 0; i < this.points.length - 1; ++i) {
            this.createRoadSegment(i);
            this.createIntersection(i);
        }
    }

    private loadTexture(path: string): Texture {
        return new TextureLoader().load(path);
    }

    private createRoadSegment(index: number): void {
        const trackDirection: Vector3 = new Vector3(this.points[(index + 1) % this.points.length].x -
                                                    this.points[index].x,
                                                    0,
                                                    this.points[(index + 1) % this.points.length].y -
                                                    this.points[index].y);

        const trackTexture: Texture = this.loadTexture(ROAD_TEXTURE_PATH);
        trackTexture.wrapS = RepeatWrapping;
        trackTexture.repeat.set(trackDirection.length() * TEXTURE_TILE_REPETIONS, 1);

        const plane: PlaneBufferGeometry = new PlaneBufferGeometry(trackDirection.length() * WORLD_SIZE, ROAD_WIDTH);
        const roadMesh: Mesh = new Mesh(plane, new MeshPhongMaterial({ map: trackTexture, side: BackSide }));

        const meshPositionWorld: Vector2 = new Vector2(-(this.points[index].y + trackDirection.z * HALF)
                                                        * WORLD_SIZE + WORLD_SIZE * HALF,
                                                       -(this.points[index].x + trackDirection.x * HALF)
                                                        * WORLD_SIZE + WORLD_SIZE * HALF);

        this.createRoad(roadMesh, trackDirection, meshPositionWorld);
    }

    private createRoad(roadMesh: Mesh, trackDirection: Vector3, meshPositionWorld: Vector2): void {
        roadMesh.position.x = meshPositionWorld.x;
        roadMesh.position.z = meshPositionWorld.y;
        roadMesh.rotation.x = PI_OVER_2;
        roadMesh.rotation.z = (trackDirection.z === 0) ? PI_OVER_2 : Math.atan(trackDirection.x / trackDirection.z);
        this.superpose(roadMesh);

        this.trackMeshes.push(roadMesh);
    }

    private createIntersection(index: number): void {
        const POLYGONS_NUMBER: number = 32;
        const trackTexture: Texture = this.loadTexture(ROAD_TEXTURE_PATH);
        const circle: CircleBufferGeometry = new CircleBufferGeometry(ROAD_WIDTH * HALF, POLYGONS_NUMBER);
        const intersectionMesh: Mesh = new Mesh(circle, new MeshPhongMaterial({ map: trackTexture, side: BackSide }));

        intersectionMesh.position.x = -(this.points[index].y) * WORLD_SIZE + WORLD_SIZE * HALF;
        intersectionMesh.position.z = -(this.points[index].x) * WORLD_SIZE + WORLD_SIZE * HALF;
        intersectionMesh.rotation.x = PI_OVER_2;
        this.superpose(intersectionMesh);

        this.trackMeshes.push(intersectionMesh);
    }

    private superpose(mesh: Mesh): void {
        this.superposition += SUPERPOSITION;
        mesh.position.y = this.superposition;
    }
}
