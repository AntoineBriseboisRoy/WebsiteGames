import { Track, TrackType } from "./track-info";

describe("TrackInfo", () => {
    it("Should correctly construct a TrackInfo instance", () => {
        const NAME: string = "Test Track";
        const DESCRIPTION: string = "This is a test track";
        const testTrack: Track = new Track(NAME, DESCRIPTION, 0, ["0:00"], TrackType.DESERT);
        expect(testTrack.Name).toBe(NAME);
        expect(testTrack.Description).toBe(DESCRIPTION);
        expect(testTrack.NPlayed).toBe(0);
        expect(testTrack.Type).toBe(TrackType.DESERT);
        expect(testTrack.BestTimes).toEqual(["0:00"]);
    });
    it("Should not create a track with a null name/description", () => {
        const testTrack: Track = new Track("", "", 0, ["0:00"], TrackType.DESERT);
        expect(testTrack.Name.length).toBeGreaterThan(0);
        expect(testTrack.Description.length).toBeGreaterThan(0);
    });
});
