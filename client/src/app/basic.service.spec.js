"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var app_module_1 = require("./app.module");
var basic_service_1 = require("./basic.service");
describe("BasicService", function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                app_module_1.AppModule
            ]
        });
    });
    it("should be created", testing_1.inject([basic_service_1.BasicService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=basic.service.spec.js.map