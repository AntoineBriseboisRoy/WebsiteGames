import { Directive, TemplateRef } from "@angular/core";
import { ModalStateService } from "./modal-state.service";

@Directive({
  selector: "ng-template[appModalDirective]",
})
export class ModalDirective {
  public constructor(modalTemplate: TemplateRef<HTMLTemplateElement>, state: ModalStateService) {
      state.template = modalTemplate;
  }
}
