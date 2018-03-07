import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { GameComponent } from "./race/game-component/game.component";

import { BasicService } from "./basic.service";
import { CrosswordViewComponent } from "./crossword/game-view/crossword-view.component";
import { TopBarComponent } from "./crossword/game-view/top-bar/top-bar.component";
import { GridComponent } from "./crossword/game-view/grid/grid.component";
import { DefinitionComponent } from "./crossword/game-view/definition/definition.component";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from ".//app-routing.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { DifficultyMenuComponent } from "./crossword/difficulty-menu/difficulty-menu.component";
import { EditTrackComponent } from "./race/edit-track/edit-track.component";
import { AdminSectionComponent } from "./admin-section/admin-section.component";
import { APP_BASE_HREF } from "@angular/common";
import { TrackViewComponent } from "./race/track-view/track-view.component";
import { GridService } from "./crossword/grid.service";
import { WordTransmitterService } from "./crossword/game-view/wordTransmitter.service";
import { PlayerMenuComponent } from "./crossword/player-menu/player-menu.component";
import { MultiplayerMenuComponent } from './crossword/multiplayer-menu/multiplayer-menu.component';

@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        CrosswordViewComponent,
        TopBarComponent,
        GridComponent,
        DefinitionComponent,
        DashboardComponent,
        DifficultyMenuComponent,
        EditTrackComponent,
        AdminSectionComponent,
        TrackViewComponent,
        PlayerMenuComponent,
        MultiplayerMenuComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        AppRoutingModule
    ],
    providers: [BasicService, GridService, WordTransmitterService, {provide: APP_BASE_HREF, useValue : "/" }],
    bootstrap: [AppComponent]
})
export class AppModule { }
