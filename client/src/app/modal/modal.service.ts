import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalStateService } from "./modal-state.service";
import { ModalOptions } from "./interfaces";

@Injectable()
export class ModalService {

    public constructor(private modalService: NgbModal, private state: ModalStateService) { }

    public async open(options: ModalOptions): Promise<void> {
        this.state.options = options;
        this.state.modal = this.modalService.open(this.state.template);

        return this.state.modal.result;
    }

    public get IsOpen(): boolean {
        return this.state.isOpen;
    }

    public closeWithFirstButton(): void {
        this.state.isOpen = false;
        this.state.modal.close("confirmed");
    }

    public closeWithSecondButton(): void {
        this.state.isOpen = false;
        this.state.modal.dismiss("not confirmed");
    }
}
