import { CameraContext } from "./camera-context";
import { TopViewCamera } from "./camera-orthogonal";
import { ThirdPersonCamera } from "./camera-perspective";
import { Vector3 } from "three";
import { CameraState } from "./camera-state";

describe("CameraContext", () => {
    const camContext: CameraContext = new CameraContext();
    const topCam: TopViewCamera = new TopViewCamera(0, 0, 0, 0, 0, 0);
    const perspectiveCam: ThirdPersonCamera = new ThirdPersonCamera(0, 0, 0, 0, 0);
    const STATE_NUMBER: number = 2;

    it("Should be created", () => {
        expect(camContext).toBeTruthy();
    });

    it("Should correctly add states", () => {
        camContext.addState(topCam);
        camContext.addState(perspectiveCam);
        expect(camContext.nStates).toEqual(STATE_NUMBER);
    });

    it("Should correctly initialize its states", () => {
        camContext.initStates(new Vector3());
        expect(camContext.CurrentState).toBeTruthy(); // The CurrentState is undefined before initStates is called.
    });

    it("Should correctly swap states (cameras)", () => {
        const previousState: CameraState = camContext.CurrentState;
        camContext.swapCameraState();
        expect(camContext.CurrentState).not.toBe(previousState);
        // There are only two possible states. Therefore, swapping should yield a different state
    });

    // We will not test the zoom functions because they already have been tested for each camera. Therefore, we know they work as intended.

    // The other methods from CameraContext's public interface are tested elsewhere,
    // as they are better tested by stimulating their reaction to keyboard events through
    // the input-manager.
});
