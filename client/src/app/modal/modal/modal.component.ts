import { Component } from "@angular/core";
import { ModalOptions } from "../interfaces";
import { ModalStateService } from "../modal-state.service";

@Component({
    selector: "app-modal",
    templateUrl: "./modal.component.html",
    styleUrls: ["./modal.component.css"]
})
export class ModalComponent {

    public options: ModalOptions;

    public constructor(private state: ModalStateService) {
        this.state.isOpen = true;
        this.options = state.options;
    }

    public firstButton(): void {
        this.state.isOpen = false;
        this.state.modal.close("confirmed");
    }

    public secondButton(): void {
        this.state.isOpen = false;
        this.state.modal.dismiss("not confirmed");
    }
}
