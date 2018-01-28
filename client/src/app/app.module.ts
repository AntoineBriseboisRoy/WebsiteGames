import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { GameComponent } from "./game-component/game.component";

import { RenderService } from "./render-service/render.service";
import { BasicService } from "./basic.service";
import { GameViewComponent } from './crossword/game-view/game-view.component';
import { TopBarComponent } from './crossword/game-view/top-bar/top-bar.component';
import { PlayerInformationComponent } from './crossword/game-view/player-information/player-information.component';
import { GridComponent } from './crossword/game-view/grid/grid.component';
import { DefinitionComponent } from './crossword/game-view/definition/definition.component';
import { GridCaseComponent } from './crossword/game-view/grid/grid-case/grid-case.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        GameViewComponent,
        TopBarComponent,
        PlayerInformationComponent,
        GridComponent,
        DefinitionComponent,
        GridCaseComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule
    ],
    providers: [
        RenderService,
        BasicService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
