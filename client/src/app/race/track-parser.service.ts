import { Injectable } from "@angular/core";
import { ITrack } from "../../../../common/interfaces/ITrack";

@Injectable()
export class TrackParserService {
    public track: ITrack;
}
