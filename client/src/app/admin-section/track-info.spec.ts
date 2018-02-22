import { TrackInfo } from "./track-info";

describe("TrackInfo", () => {
    it("Should correctly construct a TrackInfo instance", () => {
        const NAME: string = "Test Track";
        const DESCRIPTION: string = "This is a test track";
        const testTrack: TrackInfo = new TrackInfo(NAME, DESCRIPTION);
        expect(testTrack.Name).toBe(NAME);
        expect(testTrack.Description).toBe(DESCRIPTION);
    });
    it("Should not create a track with a null name/description", () => {
        const testTrack: TrackInfo = new TrackInfo("", "");
        expect(testTrack.Name.length).toBeGreaterThan(0);
        expect(testTrack.Description.length).toBeGreaterThan(0);
    });
});
