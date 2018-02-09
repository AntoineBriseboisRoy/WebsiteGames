
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CrosswordViewComponent } from "./crossword/game-view/crossword-view.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { GameComponent } from "./race/game-component/game.component";
import {DifficultyMenuComponent} from "./crossword/difficulty-menu/difficulty-menu.component";

const routes: Routes = [
    { path: "", component: DashboardComponent },
    { path: "crossword", component: DifficultyMenuComponent },
    { path: "crossword/play", component: CrosswordViewComponent },
    { path: "race", component: GameComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
