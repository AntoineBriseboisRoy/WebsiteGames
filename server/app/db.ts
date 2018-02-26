import * as mongoose from "mongoose";
import { IWordAndDefinition } from "../../common/models/wordAndDefiniton";
import { MongoError } from "mongodb";

export interface IWordAndDefinitionModel extends IWordAndDefinition, mongoose.Document {}
const wordAndDefinitionSchema: mongoose.Schema = new mongoose.Schema({
    word: String,
    definition: String
});

export const wordAndDefinition: mongoose.Model<IWordAndDefinitionModel> = mongoose.model<IWordAndDefinitionModel>("WordAndDefiniton",
                                                                                                                  wordAndDefinitionSchema);

// tslint:disable-next-line:no-any
(mongoose.Promise as any) = global.Promise;
// tslint:disable-next-line:no-console
mongoose.connect("mongodb://samarss97:jetaimeanto<3@ds139138.mlab.com:39138/log2990-22").catch((err: MongoError) => {console.log(err); });
