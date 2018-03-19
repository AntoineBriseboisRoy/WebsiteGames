import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { Message } from "../../../common/communication/message";
import { IWord } from "../../../common/interfaces/IWord";
import { injectable, } from "inversify";
import { GridGeneratorService } from "../Grid/GridGeneratorService";
import { TrackSaver } from "../mongo/track-saver";
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
            const name: string = req.query.name;
            const trackSaver: TrackSaver = new TrackSaver();
            if (name !== null) {
                res.send(trackSaver.putTrack(name, req.body as ITrack));
            }
        }

        public deleteTrack(req: Request, res: Response, next: NextFunction): void {
            const trackSaver: TrackSaver = new TrackSaver();
            const name: string = req.query.name;
            if (name !== null) {
                res.send(trackSaver.deleteTrack(name));
            }
        }

        public getTrack(req: Request, res: Response, next: NextFunction): void {
            const name: string = req.query.name;
            if (name !== null) {
                const trackSaver: TrackSaver = new TrackSaver();
                trackSaver.getTrack(name).then((track: ITrack) => res.send(track));
            }
        }

        public getAllTracks(req: Request, res: Response, next: NextFunction): void {
            const trackSaver: TrackSaver = new TrackSaver();
            trackSaver.getAllTracks().then((tracks: ITrack[]) => res.send(tracks));
        }
    }
}

export = Route;
