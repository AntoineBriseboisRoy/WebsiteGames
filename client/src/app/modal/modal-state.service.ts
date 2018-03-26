import { Injectable, TemplateRef } from "@angular/core";
import { ModalOptions } from "./interfaces";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

@Injectable()
export class ModalStateService {
    public options: ModalOptions;
    public modal: NgbModalRef;
    public template: TemplateRef<HTMLTemplateElement>;
    public isOpen: boolean;

    public constructor() {
        this.options = {title: "", message: "", firstButton: "", secondButton: ""} as ModalOptions;
        this.modal = undefined;
        this.template = undefined;
    }
}
