import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-crossword-definition",
    templateUrl: "./definition.component.html",
    styleUrls: ["./definition.component.css"]
})
export class DefinitionComponent implements OnInit {
    private readonly horizontalDefinitions: string[];
    private readonly verticalDefinitions: string[];
    public constructor() {
        this.horizontalDefinitions = ["1. Lorem ipsum dolor sit amet, et",
                                      "2.  sea. Cu harum dolor fabellas",
                                      "3. Ea decore copiosae recusabo quo."];
        this.verticalDefinitions = ["1.  sea. Cu harum dolor fabellas",
                                    "2. Ea decore copiosae recusabo quo. ",
                                    "3. Lorem ipsum dolor sit amet, et"];
    }

    public ngOnInit(): void {
    }
}
