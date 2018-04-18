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
import { PlayerMenuComponent } from "./crossword/player-menu/player-menu.component";
import { MultiplayerMenuComponent } from "./crossword/multiplayer-mode/multiplayer-menu.component";
import { MongoQueryService } from "./mongo-query.service";
import { SocketIoService } from "./crossword/socket-io.service";
import { GameRoomManagerService } from "./crossword/multiplayer-mode/game-room-manager.service";
import { GameListComponent } from "./crossword/multiplayer-mode/GameList/game-list.component";
import { CollisionManager } from "./race/car/collision-manager.service";
import { RoadCreator } from "./race/render-service/road-creator.service";
import { ModalComponent } from "./modal/modal/modal.component";
import { ModalService } from "./modal//modal.service";
import { ModalStateService } from "./modal//modal-state.service";
import { ModalDirective } from "./modal/modal.directive";
import { TrackPreviewComponent } from "./race/track-view/track-preview/track-preview.component";
import { StartLineGeneratorService } from "./race/start-line-generator.service";
import { GameManagerService } from "./crossword/game-manager.service";
import { SoundManagerService } from "./race/sound-manager.service";
import { SelectionHandlerService } from "./crossword/game-view/grid/selection-handler.service";
import { TimerService } from "./race/timer-service/timer.service";
import { InputManagerService } from "./race/input-manager-service/input-manager.service";
import { WaitingScreenComponent } from "./crossword/waiting-screen/waiting-screen.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { EndGameService } from "./crossword/end-game.service";
import { RaceResultsComponent } from "./race/race-results/race-results.component";
import { RenderService } from "./race/render-service/render.service";

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
        GameListComponent,
        ModalComponent,
        ModalDirective,
        TrackPreviewComponent,
        WaitingScreenComponent,
        RaceResultsComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        AppRoutingModule,
        MatProgressSpinnerModule,
        NgbModule.forRoot()
    ],
    providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        RenderService,
        MongoQueryService,
        GridService,
        GameRoomManagerService,
        SocketIoService,
        CollisionManager,
        RoadCreator,
        ModalService,
        ModalStateService,
        StartLineGeneratorService,
        GameManagerService,
        SoundManagerService,
        SelectionHandlerService,
        TimerService,
        InputManagerService,
        EndGameService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
