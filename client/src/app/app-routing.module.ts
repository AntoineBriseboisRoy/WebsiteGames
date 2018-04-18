
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CrosswordViewComponent } from "./crossword/game-view/crossword-view.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { GameComponent } from "./race/game-component/game.component";
import { EditTrackComponent } from "./race/edit-track/edit-track.component";
import { AdminSectionComponent } from "./admin-section/admin-section.component";
import { TrackViewComponent } from "./race/track-view/track-view.component";
import { PlayerMenuComponent } from "./crossword/player-menu/player-menu.component";
import { DifficultyMenuComponent } from "./crossword/difficulty-menu/difficulty-menu.component";
import { MultiplayerMenuComponent } from "./crossword/multiplayer-mode/multiplayer-menu.component";
import { WaitingScreenComponent } from "./crossword/waiting-screen/waiting-screen.component";
import { RaceResultsComponent } from "./race/race-results/race-results.component";

const routes: Routes = [
    { path: "", component: DashboardComponent },
    { path: "crossword", component: PlayerMenuComponent },
    { path: "crossword/difficulty", component: DifficultyMenuComponent },
    { path: "crossword/multiplayer", component: MultiplayerMenuComponent },
    { path: "crossword/play", component: CrosswordViewComponent },
    { path: "crossword/waiting", component: WaitingScreenComponent },
    { path: "edit", component: EditTrackComponent },
    { path: "race/play", component: GameComponent },
    { path: "race/results", component: RaceResultsComponent},
    { path: "admin", component: AdminSectionComponent },
    { path: "race", component: TrackViewComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
