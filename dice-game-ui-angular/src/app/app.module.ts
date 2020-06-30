import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartGameComponent } from './start-game/start-game.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { GameComponent } from './game/game.component';
import { MainComponent } from './main/main.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { SavedGamesComponent } from './saved-games/saved-games.component';
import { GameStorageService } from './services/game-storage-service';
import { LocalGameStorageService } from './services/local-game-storage-service';
import { StatisticsService } from './services/statistics-service';
import { LocalStatisticsService } from './services/local-statistics-service';

@NgModule({
  declarations: [
    AppComponent,
    StartGameComponent,
    NavMenuComponent,
    GameComponent,
    MainComponent,
    SavedGamesComponent,
    StatisticsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,

    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSidenavModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
  ],
  providers: [
    { provide: GameStorageService, useClass: LocalGameStorageService },
    { provide: StatisticsService, useClass: LocalStatisticsService },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
