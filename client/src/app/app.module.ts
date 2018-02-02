import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { GameComponent } from "./race/game-component/game.component";

import { RenderService } from "./race/render-service/render.service";
import { BasicService } from "./basic.service";
import { CrosswordViewComponent } from './crossword/game-view/crossword-view.component';
import { TopBarComponent } from './crossword/game-view/top-bar/top-bar.component';
import { PlayerInformationComponent } from './crossword/game-view/player-information/player-information.component';
import { GridComponent } from './crossword/game-view/grid/grid.component';
import { DefinitionComponent } from './crossword/game-view/definition/definition.component';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './/app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        CrosswordViewComponent,
        TopBarComponent,
        PlayerInformationComponent,
        GridComponent,
        DefinitionComponent,
        DashboardComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        AppRoutingModule
    ],
    providers: [
        RenderService,
        BasicService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
