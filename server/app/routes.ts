import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

import Types from "./types";
import { Index } from "./routes/index";

@injectable()
export class Routes {

    public constructor(@inject(Types.Index) private index: Index) { }

    public get routes(): Router {
        const router: Router = Router();

        router.get("/",
                   (req: Request, res: Response, next: NextFunction) => this.index.helloWorld(req, res, next));

        router.get("/getGames",
                   (req: Request, res: Response, next: NextFunction) => this.index.getGames(req, res, next));

        router.get("/getGrid",
                   (req: Request, res: Response, next: NextFunction) => this.index.getGrid(req, res, next));

        router.get("/getWords",
                   (req: Request, res: Response, next: NextFunction) => this.index.getWords(req, res, next));

        router.post("/postTrack",
                    (req: Request, res: Response, next: NextFunction) => this.index.postTrack(req, res, next));

        router.put("/putTrack",
                   (req: Request, res: Response, next: NextFunction) => this.index.putTrack(req, res, next));

        router.post("/deleteTrack",
                    (req: Request, res: Response, next: NextFunction) => this.index.deleteTrack(req, res, next));

        router.get("/getTrack",
                   (req: Request, res: Response, next: NextFunction) => this.index.getTrack(req, res, next));

        router.get("/getAllTracks",
                   (req: Request, res: Response, next: NextFunction) => this.index.getAllTracks(req, res, next));

        return router;
    }
}
