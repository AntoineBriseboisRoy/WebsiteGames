import { ThirdPersonCamera } from "./camera-perspective";
import { FIELD_OF_VIEW, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE } from "../render-service/render.service";

describe("CameraPerspective", () => {
  it("should be instantiated correctly when passing parameters", () => {
    const width: number = 100;
    const height: number = 100;
    const camera: ThirdPersonCamera = new ThirdPersonCamera (FIELD_OF_VIEW,
                                                             NEAR_CLIPPING_PLANE,
                                                             FAR_CLIPPING_PLANE,
                                                             width, height);
    expect(camera).toBeDefined();
  });
});
