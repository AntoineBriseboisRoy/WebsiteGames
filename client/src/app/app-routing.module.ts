import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CrosswordViewComponent} from './crossword/game-view/crossword-view.component'
import {DashboardComponent} from './dashboard/dashboard.component'

const routes: Routes = [
  // { path: '', redirectTo: '/crossword', pathMatch: 'full' },
  {path: '', component:DashboardComponent},
  {path: 'crossword', component:CrosswordViewComponent}
];

@NgModule({
  imports:[RouterModule.forRoot(routes)],
  exports:[RouterModule]
})
export class AppRoutingModule { }

