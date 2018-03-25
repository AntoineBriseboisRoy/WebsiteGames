import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { Message } from "../../../common/communication/message";
import { injectable, } from "inversify";
import { TrackSaver } from "../mongo/track-saver";
import { ITrack } from "../../../common/interfaces/ITrack";
import { INewGame } from "../../../common/interfaces/INewGame";
import { WaitingGamesService } from "../Services/Multiplayer-menu-service/waiting-games.service";
import { WordTransmitterService } from "../Services/WordTransmitterService/wordTransmitter.service";
import { ICell } from "../../../common/interfaces/ICell";
import { IGridWord } from "../../../common/interfaces/IGridWord";

module Route {

    @injectable()
    export class Index {

        public helloWorld(req: Request, res: Response, next: NextFunction): void {
            const message: Message = new Message();
            message.title = "Hello";
            message.body = "World";
            res.send(JSON.stringify(message));
        }
        public getGames(req: Request, res: Response, next: NextFunction): void {
            const games: Array<INewGame> = WaitingGamesService.Instance.Games;
            res.send(JSON.stringify(games));
        }

        public getGrid(req: Request, res: Response, next: NextFunction): void {
            const gridContent: Array<ICell> = WordTransmitterService.Instance.getCells();
            res.send(JSON.stringify(gridContent));
        }

        public getWords(req: Request, res: Response, next: NextFunction): void {
            const words: Array<IGridWord> = WordTransmitterService.Instance.getTransformedWords();
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
