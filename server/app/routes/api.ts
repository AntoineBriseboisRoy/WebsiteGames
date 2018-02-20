
import { Request, Response, NextFunction } from "express";
import { Message } from "../../../common/communication/message";
import "reflect-metadata";
import { injectable } from "inversify";
import { wordAndDefinition, IWordAndDefinitionModel } from "../db";

module Route {

    @injectable()
    export class Api {
        public helloWorld(req: Request, res: Response, next: NextFunction): void {
            const message: Message = new Message();
            message.title = "Hello";
            message.body = "World";
            res.send(JSON.stringify(message));
        }

        public getWordAndDefinition(req: Request, res: Response, next: NextFunction): void {
            const constraints: RegExp = req.query["constraints"];
            const length: number = req.query["length"];

            wordAndDefinition.find(
                {
                word: {
                    $regex: constraints
                }
            }).then((wordsAndDefinitions: IWordAndDefinitionModel[]) => {
                const filteredData: IWordAndDefinitionModel[] = wordsAndDefinitions.filter( (wd: IWordAndDefinitionModel) => {
                    return wd.word.length === length;
                });
                res.json(filteredData);
            }
            // tslint:disable-next-line:no-any
            ).catch((reason: any) => {
                res.send(reason);
            });
        }
    }
}

export = Route;
