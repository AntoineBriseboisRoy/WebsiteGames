import { ModalDirective } from "./modal.directive";
import { TemplateRef } from "@angular/core";
import { ModalStateService } from "./modal-state.service";

describe("ModalDirective", () => {
  it("should create an instance", () => {
    const directive: ModalDirective = new ModalDirective({} as TemplateRef<HTMLTemplateElement>, {} as ModalStateService);
    expect(directive).toBeTruthy();
  });
});
