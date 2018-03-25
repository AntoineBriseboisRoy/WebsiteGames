import { Injectable } from "@angular/core";
import { CollisionManager } from "../car/collision-manager";
import { Point } from "../edit-track/Geometry";
import { Texture, TextureLoader, RepeatWrapping, Vector3, Mesh, PlaneBufferGeometry,
         MeshBasicMaterial, BackSide, DoubleSide, Vector2, CircleBufferGeometry, CylinderGeometry } from "three";
import { HALF, PI_OVER_2 } from "../../constants";
import { InvalidArgumentError } from "../../invalidArgumentError";

const TEXTURE_TILE_REPETIONS: number = 200;
const WORLD_SIZE: number = 1000;
// const FLOOR_SIZE: number = WORLD_SIZE / HALF;
const ROAD_WIDTH: number = 10;
const SUPERPOSITION: number = 0.001;
@Injectable()
export class RoadCreator {

    private points: Point[];
    private meshes: Mesh[];
    private superposition: number;
    public constructor(private collisionManager: CollisionManager) {
        this.points = new Array<Point>();
        this.meshes = new Array<Mesh>();
        this.superposition = 0;
    }
    public createTrack(points: Point[]): Mesh[] {
        this.points = points;
        this.meshes = new Array<Mesh>();
        for (let i: number = 0; i < this.points.length - 1; ++i) {
            this.createRoadSegment(i);
            this.createIntersection(i);
            this.createIntersectionWall(i + 1);
        }

        return this.meshes;
    }

    // tslint:disable-next-line:max-func-body-length
    private createRoadSegment(index: number): void {
        const trackTexture: Texture = new TextureLoader().load("/assets/road.jpg");
        trackTexture.wrapS = RepeatWrapping;

        const roadVectors: Vector3[] = this.createRoadVectors(index);
        this.calculateAngles(roadVectors);

        trackTexture.repeat.set(roadVectors[1].length() * TEXTURE_TILE_REPETIONS, 1);

        const direction: Vector3 = new Vector3(0, 1, 0).cross(roadVectors[1]);

        const plane: PlaneBufferGeometry = new PlaneBufferGeometry(roadVectors[1].length() * WORLD_SIZE, ROAD_WIDTH);
        const planeInside: PlaneBufferGeometry = new PlaneBufferGeometry(roadVectors[1].length() * WORLD_SIZE - ROAD_WIDTH, ROAD_WIDTH);
        const planeOutside: PlaneBufferGeometry = new PlaneBufferGeometry(roadVectors[1].length() * WORLD_SIZE - ROAD_WIDTH, ROAD_WIDTH);

        const mesh: Mesh[] = new Array<Mesh>();
        mesh.push(new Mesh(plane, new MeshBasicMaterial({ map: trackTexture, side: BackSide })));
        mesh.push(new Mesh(planeInside, new MeshBasicMaterial({ map: trackTexture, side: DoubleSide })));
        mesh.push(new Mesh(planeOutside, new MeshBasicMaterial({ map: trackTexture, side: DoubleSide })));

        const meshPositionWorld: Vector2 = new Vector2(-(this.points[index].y + roadVectors[1].z * HALF)
                                                       * WORLD_SIZE + WORLD_SIZE * HALF,
                                                       -(this.points[index].x + roadVectors[1].x * HALF)
                                                       * WORLD_SIZE + WORLD_SIZE * HALF);

        this.createRoad(mesh[0], roadVectors[1], meshPositionWorld);

        const distanceRoadBorder: Vector2 = new Vector2(direction.normalize().z * ROAD_WIDTH * HALF,
                                                        direction.normalize().x * ROAD_WIDTH * HALF);

        this.createWall(mesh[2], roadVectors[1], meshPositionWorld, distanceRoadBorder);
        this.createWall(mesh[1], roadVectors[1], meshPositionWorld, distanceRoadBorder.negate());
    }

    private calculateAngles(roadVectors: Vector3[]): number[] {
        const angles: number[] = new Array<number>();

        for (let i: number = 0; i < roadVectors.length - 1; ++i) {
            angles.push(roadVectors[i + 1].angleTo(roadVectors[i]));
        }

        return angles;
    }

    private createRoadVectors(index: number): Vector3[] {
        const roadVectors: Vector3[] = new Array<Vector3>();
        try {
            roadVectors.push(this.getPreviousSegmentVector(index));
            roadVectors.push(this.getCurrentSegmentVector(index));
            roadVectors.push(this.getNextSegmentVector(index));
        } catch (error) {
            throw new InvalidArgumentError(error);
        }

        return roadVectors;
    }

    private getNextSegmentVector(index: number): Vector3 {
        if (index === this.points.length - 2) {
            return new Vector3(this.points[(index + 3) % this.points.length].x -
                               this.points[(index + 1) % this.points.length].x,
                               0,
                               this.points[(index + 3) % this.points.length].y -
                               this.points[(index + 1) % this.points.length].y);
        } else {
            return new Vector3(this.points[(index + 2) % this.points.length].x -
                               this.points[(index + 1) % this.points.length].x,
                               0,
                               this.points[(index + 2) % this.points.length].y -
                               this.points[(index + 1) % this.points.length].y);
        }
    }

    private getCurrentSegmentVector(index: number): Vector3 {
        return new Vector3(this.points[(index + 1) % this.points.length].x -
                           this.points[index].x,
                           0,
                           this.points[(index + 1) % this.points.length].y -
                           this.points[index].y);
    }

    private getPreviousSegmentVector(index: number): Vector3 {
        if (index === 0) {
            return new Vector3(this.points[0].x -
                               this.points[this.points.length - 2].x,
                               0,
                               this.points[0].y -
                               this.points[this.points.length - 2].y);
        } else {
            return new Vector3(this.points[index].x -
                               this.points[index - 1].x,
                               0,
                               this.points[index].y -
                               this.points[index - 1].y);
        }
    }

    private createRoad(mesh: Mesh, trackDirection: Vector3, meshPositionWorld: Vector2): void {
        mesh.position.x = meshPositionWorld.x;
        mesh.position.z = meshPositionWorld.y;
        mesh.rotation.x = PI_OVER_2;
        mesh.rotation.z = trackDirection.z === 0 ? PI_OVER_2 : Math.atan(trackDirection.x / trackDirection.z);
        this.superpose(mesh);

        this.meshes.push(mesh);
    }

    private createWall(mesh: Mesh, trackDirection: Vector3, meshPositionWorld: Vector2, distanceRoadBorder: Vector2): void {
        mesh.position.x = meshPositionWorld.x + distanceRoadBorder.x;
        mesh.position.z = meshPositionWorld.y + distanceRoadBorder.y;
        mesh.rotation.y = trackDirection.x === 0 ? 0 : Math.atan(trackDirection.z / trackDirection.x) + PI_OVER_2;

        this.meshes.push(mesh);
        this.collisionManager.addWall(mesh);
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

    // TODO: Calculate 2 angles from wall length - segment length (and refactor into 2 methods)
    private createIntersectionWall(index: number): void {
        const vectorA: Vector3 = new Vector3(this.points[(index + 1) % this.points.length].x -
                                             this.points[index].x,
                                             0,
                                             this.points[(index + 1) % this.points.length].y -
                                             this.points[index].y);
        const vectorB: Vector3 = new Vector3(this.points[index].x -
                                             this.points[(index - 1) % this.points.length].x,
                                             0, this.points[index].y -
                                             this.points[(index - 1) % this.points.length].y);

        const small: number = vectorB.angleTo(new Vector3(1, 0, 0)); // Default start is 0, equiv. to 3 o'clock.
        const thetaLength: number = vectorA.angleTo(vectorB);
        const thetaStart: number = small + thetaLength;

        const geometry: CylinderGeometry = new CylinderGeometry(ROAD_WIDTH * HALF, ROAD_WIDTH * HALF, ROAD_WIDTH * HALF,
                                                                15, 1, true, thetaStart, thetaLength);
        const cornerWall: Mesh = new Mesh(geometry, new MeshBasicMaterial({ color: 0xFFFF00, side: DoubleSide}));

        cornerWall.position.x = -(this.points[index].y) * WORLD_SIZE + WORLD_SIZE * HALF;
        cornerWall.position.y = ROAD_WIDTH * HALF * HALF;
        cornerWall.position.z = -(this.points[index].x) * WORLD_SIZE + WORLD_SIZE * HALF;

        this.meshes.push(cornerWall);
        this.collisionManager.addWall(cornerWall);
    }
}
