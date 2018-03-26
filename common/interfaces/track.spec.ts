import { ITrack, TrackType } from "./track";

describe("TrackInfo", () => {
    it("Should correctly construct a TrackInfo instance", () => {
        const NAME: string = "Test Track";
        const DESCRIPTION: string = "This is a test track";
        const testTrack: ITrack = {_id: "", name: NAME, description: DESCRIPTION, nTimesPlayed: 0,
                                   bestTimes: ["0:00"], type: TrackType.DESERT} as ITrack;
        expect(testTrack.name).toBe(NAME);
        expect(testTrack.description).toBe(DESCRIPTION);
        expect(testTrack.nTimesPlayed).toBe(0);
        expect(testTrack.type).toBe(TrackType.DESERT);
        expect(testTrack.bestTimes).toEqual(["0:00"]);
    });
    it("Should not create a track with a null name/description", () => {
        const testTrack: ITrack = {_id: "", name: "", description: "", nTimesPlayed: 0,
                                   bestTimes: ["0:00"], type: TrackType.DESERT} as ITrack;
        expect(testTrack.name.length).toBeGreaterThan(0);
        expect(testTrack.description.length).toBeGreaterThan(0);
    });
});
