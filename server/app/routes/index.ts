import { Request, Response, NextFunction } from "express";
import { Message } from "../../../common/communication/message";
import "reflect-metadata";
import { injectable, } from "inversify";
import { GridGeneratorService } from "../Grid/GridGeneratorService";

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
            message.body = GridGeneratorService.Instance.getFakeGridContent();
            res.send(JSON.stringify(message));
        }

        public getWords(req: Request, res: Response, next: NextFunction): void {
            const message: Message = new Message();
            message.title = "Fetching grid";
            message.body = GridGeneratorService.Instance.getFakeGridWords();
            res.send(JSON.stringify(message));
        }
    }
}

export = Route;
