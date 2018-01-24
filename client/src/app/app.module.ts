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

@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        GameViewComponent,
        TopBarComponent,
        PlayerInformationComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule
    ],
    providers: [
        RenderService,
        BasicService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
