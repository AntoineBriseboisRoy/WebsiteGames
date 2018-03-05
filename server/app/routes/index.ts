import { Request, Response, NextFunction } from "express";
import { Message } from "../../../common/communication/message";
import "reflect-metadata";
import { injectable, } from "inversify";
import { GridGeneratorService } from "../Grid/GridGeneratorService";
import { Track, TrackType } from "../../../client/src/app/admin-section/track";

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
            const message: Message = new Message();
            message.title = "Fetching grid";
            message.body = GridGeneratorService.Instance.Grid;
            res.send(JSON.stringify(message));
        }

        public getTrack(req: Request, res: Response, next: NextFunction): void {
            res.send(JSON.stringify(new Track("test Track", "this is a test", 0, ["0:00"], TrackType.RAIN)));
        }

        public postTrack(req: Request, res: Response, next: NextFunction): void {
            console.log(req);
            res.send(JSON.stringify(req));
        }
    }
}

export = Route;
