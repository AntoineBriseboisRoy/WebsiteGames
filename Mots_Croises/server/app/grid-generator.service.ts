import { Injectable } from "../../client/node_modules/@angular/core";

import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";

import { Grid } from "./Grid/Grid";

const DEFAULT_PERCENTAGE: number = 0.2;

@Injectable()
export class GridGeneratorService {

  private grid: Grid;

  constructor() { }

  public getGrid(): Grid {
      return this.grid;
  }

  public generateNewGrid(size: number): Observable<Grid> {
      this.grid = new Grid(size, DEFAULT_PERCENTAGE);

      return of(this.grid);
  }

}
