import { TestBed, inject } from "@angular/core/testing";

import { MongoQueryService } from "./mongo-query.service";

describe("MongoQueryService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MongoQueryService]
    });
  });

  it("should be created", inject([MongoQueryService], (service: MongoQueryService) => {
    expect(service).toBeTruthy();
  }));
});
