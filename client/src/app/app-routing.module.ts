
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CrosswordViewComponent } from "./crossword/game-view/crossword-view.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { GameComponent } from "./race/game-component/game.component";
import { EditTrackComponent } from "./race/edit-track/edit-track.component";

const routes: Routes = [
    { path: "", component: DashboardComponent },
    { path: "crossword", component: CrosswordViewComponent },
    { path: "race", component: GameComponent },
    { path: "edit", component: EditTrackComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
