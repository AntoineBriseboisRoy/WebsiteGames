import { Injectable } from "@angular/core";
import { Point } from "../edit-track/Geometry";
import { Texture, TextureLoader, RepeatWrapping, Vector3, Mesh, PlaneBufferGeometry,
         BackSide, Vector2, CircleBufferGeometry, MeshPhongMaterial, Material, MeshBasicMaterial, DoubleSide } from "three";
import { HALF, PI_OVER_2, ROAD_WIDTH } from "../../constants";

const TEXTURE_TILE_REPETIONS: number = 200;
const WORLD_SIZE: number = 1000;
const SUPERPOSITION: number = 0.001;
const ROAD_TEXTURE_PATH: string = "/assets/uniformRoad.jpg";
const CHECKPOINT_OFFSET: number = 19;
@Injectable()
export class RoadCreator {
    private points: Point[];
    private trackMeshes: Mesh[];
    private checkpointMeshes: Mesh[];
    private checkpointsSegments: Array<[Vector2, Vector2]>;
    private superposition: number;

    public get Meshes(): Mesh[] {
        return this.trackMeshes;
    }

    public get CheckpointMeshes(): Mesh[] {
        return this.checkpointMeshes;
    }

    public get CheckpointsSegments(): Array<[Vector2, Vector2]> {
        return this.checkpointsSegments;
    }

    public constructor() {
        this.points = new Array<Point>();
        this.trackMeshes = new Array<Mesh>();
        this.checkpointMeshes = new Array<Mesh>();
        this.checkpointsSegments = new Array<[Vector2, Vector2]>();
        this.superposition = 0;
    }

    public createTrack(points: Point[]): void {
        this.points = points;
        for (let i: number = 0; i < this.points.length - 1; ++i) {
            const trackDirection: Vector3 = this.calculateTrackDirection(i);
            this.createRoadSegment(i, trackDirection);
            this.createIntersection(i);
            this.createCheckpoint((i + 1) % (this.points.length - 1), trackDirection);
        }
    }

    private loadTexture(path: string): Texture {
        return new TextureLoader().load(path);
    }

    private calculateTrackDirection(i: number): Vector3 {
        return new Vector3(this.points[(i + 1) % this.points.length].x - this.points[i].x, 0,
                           this.points[(i + 1) % this.points.length].y - this.points[i].y);
    }

    private createRoadSegment(index: number, trackDirection: Vector3): void {
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

    private createCheckpoint(index: number, trackDirection: Vector3): void {
        const angle: number = this.calculateAngle(index, trackDirection);

        const checkpointMesh: Mesh = new Mesh(new PlaneBufferGeometry(1, ROAD_WIDTH),
                                              new MeshBasicMaterial({ wireframe: true, opacity: 0, transparent: false, side: DoubleSide }));
        checkpointMesh.position.x = -(this.points[index].y) * WORLD_SIZE + WORLD_SIZE * HALF + (1 / angle) * CHECKPOINT_OFFSET *
                                    trackDirection.normalize().z;
        checkpointMesh.position.z = -(this.points[index].x) * WORLD_SIZE + WORLD_SIZE * HALF + (1 / angle) * CHECKPOINT_OFFSET *
                                    trackDirection.normalize().x;
        checkpointMesh.rotation.x = PI_OVER_2;
        checkpointMesh.rotation.z = (trackDirection.z === 0) ? PI_OVER_2 : Math.atan(trackDirection.x / trackDirection.z);
        this.superpose(checkpointMesh);
        this.checkpointMeshes.push(checkpointMesh);
        this.createCheckpointSegment(checkpointMesh, trackDirection);
    }

    private createCheckpointSegment(checkpointMesh: Mesh, trackDirection: Vector3): void {
        const perpendicularToTrackDirection: Vector2 = new Vector2(-trackDirection.x, trackDirection.z);
        const leftPoint: Vector2 = new Vector2(checkpointMesh.position.x + ROAD_WIDTH * HALF * perpendicularToTrackDirection.normalize().x,
                                               checkpointMesh.position.z + ROAD_WIDTH * HALF * perpendicularToTrackDirection.normalize().y
                                              );
        const rightPoint: Vector2 = new Vector2(checkpointMesh.position.x - ROAD_WIDTH * HALF * perpendicularToTrackDirection.normalize().x,
                                                checkpointMesh.position.z - ROAD_WIDTH * HALF * perpendicularToTrackDirection.normalize().y
                                               );
        this.checkpointsSegments.push([leftPoint, rightPoint]);
    }

    private calculateAngle(index: number, trackDirection: Vector3): number {
        const nextSegmentDirection: Vector3 = new Vector3(-(this.points[(index + 1) % (this.points.length - 1)].x - this.points[index].x),
                                                          0,
                                                          -(this.points[(index + 1) % (this.points.length - 1)].y - this.points[index].y));

        return Math.acos(nextSegmentDirection.dot(trackDirection) /
            (nextSegmentDirection.length() * trackDirection.length()));
    }

    private superpose(mesh: Mesh): void {
        this.superposition += SUPERPOSITION;
        mesh.position.y = this.superposition;
    }
}
