import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { Message } from "../../../common/communication/message";
import { IWord } from "../../../common/interfaces/IWord";
import { injectable, } from "inversify";
import { GridGeneratorService } from "../Grid/GridGeneratorService";
import { TrackSaver } from "../mongo/track-saver";
import { IBasicTrackInfo } from "../../../common/interfaces/IBasicTrackInfo";
import { ITrack } from "../../../common/interfaces/ITrack";

module Route {

    @injectable()
    export class Index {

        public helloWorld(req: Request, res: Response, next: NextFunction): void {
            const message: Message = new Message();
            message.title = "Hello";
            message.body = "World";
            res.send(JSON.stringify(message));
        }

        public getGrid(req: Request, res: Response, next: NextFunction): void {
            const gridContent: string = GridGeneratorService.Instance.getFakeGridContent();
            res.send(JSON.stringify(gridContent));
        }

        public getWords(req: Request, res: Response, next: NextFunction): void {
            const words: Array<IWord> = GridGeneratorService.Instance.getFakeGridWords();
            res.send(JSON.stringify(words));
        }

        public postTrack(req: Request, res: Response, next: NextFunction): void {
            const trackSaver: TrackSaver = new TrackSaver();
            res.send(trackSaver.postTrack(req.body as ITrack));
        }

        public putTrack(req: Request, res: Response, next: NextFunction): void {
            const trackSaver: TrackSaver = new TrackSaver();
            res.send(trackSaver.putTrack(req.body as IBasicTrackInfo));
        }

        public deleteTrack(req: Request, res: Response, next: NextFunction): void {
            const trackSaver: TrackSaver = new TrackSaver();
            res.send(trackSaver.deleteTrack(req.body));
        }

        public getTrack(req: Request, res: Response, next: NextFunction): void {
            const trackSaver: TrackSaver = new TrackSaver();
            res.send(trackSaver.getTrack(req.body));
        }

        public getAllTracks(req: Request, res: Response, next: NextFunction): void {
            const trackSaver: TrackSaver = new TrackSaver();
            trackSaver.getAllTracks().then((tracks: ITrack[]) => {
                res.send(tracks);
            });
        }
    }
}

export = Route;
