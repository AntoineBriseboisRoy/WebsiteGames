import { Request, Response, NextFunction } from "express";
import { Message } from "../../../common/communication/message";
import { IWord } from "../../../common/interfaces/IWord";
import "reflect-metadata";
import { injectable, } from "inversify";
import { GridGeneratorService } from "../Grid/GridGeneratorService";
import { Track, TrackType } from "../../../client/src/app/admin-section/track";
import { TrackSaver } from "../mongo/track-saver";

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

        public getTrack(req: Request, res: Response, next: NextFunction): void {
            res.send(JSON.stringify(new Track("test Track", "this is a test", 0, ["0:00"], TrackType.RAIN)));
        }

        public postTrack(req: Request, res: Response, next: NextFunction): void {
            const trackSaver: TrackSaver = new TrackSaver();
            trackSaver.postTrack(req.body as Track);
        }
    }
}

export = Route;
