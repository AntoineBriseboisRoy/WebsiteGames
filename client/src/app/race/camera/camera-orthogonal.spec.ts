import { TopViewCamera } from "./camera-orthogonal";

describe("CameraOrthogonal", () => {
  let camera: TopViewCamera;

  it("should be instantiated correctly when passing parameters", () => {
    const top: number    = 100;
    const bottom: number = 100;
    const left: number   = 100;
    const right: number  = 100;
    const near: number   = 1;
    const far: number    = 1000;
    camera = new TopViewCamera(left, right, top, bottom, near, far);
    expect(camera).toBeDefined();
  });
});
