import { OnInit } from "@angular/core";
import { Position } from "./position";

export class Word implements OnInit {
    public constructor(private readonly id: number,
                       private readonly startPos: Position,
                       private readonly content: string) {
    }

    public ngOnInit(): void {
    }

    public getValue(): Array<string> {
        return this.content.split("");
    }

}
