import { NgModule } from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {CrosswordViewComponent} from "./crossword/game-view/crossword-view.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {GameComponent} from "./game-component/game.component";

const routes: Routes = [
  // { path: '', redirectTo: '/crossword', pathMatch: 'full' },
  {path: "", component: DashboardComponent},
  {path: "crossword", component: CrosswordViewComponent},
  {path: "race", component: GameComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
