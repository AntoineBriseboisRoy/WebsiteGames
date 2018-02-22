const UNDEFINED_NAME: string = "Unknown track";
const UNDEFINED_DESCRIPTION: string = "Unknown description.";

export class TrackInfo {
    private name: string;
    private description: string;

    public constructor(name: string, description: string) {
        this.name = (name.length > 0) ? name : UNDEFINED_NAME;
        this.description = (description.length) ? description : UNDEFINED_DESCRIPTION;
    }

    public get Name(): string {
        return this.name;
    }

    public get Description(): string {
        return this.description;
    }
}
