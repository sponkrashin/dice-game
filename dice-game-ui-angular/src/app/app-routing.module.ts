import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartGameComponent } from './start-game/start-game.component';
import { GameComponent } from './game/game.component';
import { MainComponent } from './main/main.component';
import { StatisticsComponent } from './statistics/statistics.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'start', component: StartGameComponent },
  { path: 'game/:id', component: GameComponent },
  { path: 'statistics', component: StatisticsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
