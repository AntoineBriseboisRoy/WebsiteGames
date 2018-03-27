import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppComponent } from "./app.component";
import { GameComponent } from "./race/game-component/game.component";

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
import { MultiplayerMenuComponent } from "./crossword/multiplayer-menu/multiplayer-menu.component";
import { MongoQueryService } from "./mongo-query.service";
import { SocketIoService } from "./crossword/socket-io.service";
import { MultiplayerGamesService } from "./crossword/multiplayer-menu/multiplayer-games.service";
import { WaitingGamesComponent } from "./crossword/multiplayer-menu/waiting-games/waiting-games.component";
import { CollisionManager } from "./race/car/collision-manager.service";
import { RoadCreator } from "./race/render-service/road-creator.service";
import { ModalComponent } from "./modal/modal/modal.component";
import { ModalService } from "./modal//modal.service";
import { ModalStateService } from "./modal//modal-state.service";
import { ModalDirective } from "./modal/modal.directive";

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
        MultiplayerMenuComponent,
        WaitingGamesComponent,
        ModalComponent,
        ModalDirective
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        AppRoutingModule,
        NgbModule.forRoot()
    ],
    providers: [
        { provide: APP_BASE_HREF, useValue : "/" },
        MongoQueryService,
        GridService,
        WordTransmitterService,
        MultiplayerGamesService,
        SocketIoService,
        CollisionManager,
        RoadCreator,
        ModalService,
        ModalStateService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
