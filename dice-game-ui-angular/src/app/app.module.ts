import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartGameComponent } from './start-game/start-game.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { GameComponent } from './game/game.component';
import { MainComponent } from './main/main.component';
import { GameStorageService } from './services/game-storage-service';
import { LocalGameStorageService } from './services/local-game-storage-service';
import { SavedGamesComponent } from './saved-games/saved-games.component';

@NgModule({
  declarations: [AppComponent, StartGameComponent, NavMenuComponent, GameComponent, MainComponent, SavedGamesComponent],
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
  ],
  providers: [{ provide: GameStorageService, useClass: LocalGameStorageService }],
  bootstrap: [AppComponent],
})
export class AppModule {}
