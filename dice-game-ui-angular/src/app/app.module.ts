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

import {
  SocialAuthServiceConfig,
  SocialLoginModule,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from 'angularx-social-login';

import { environment } from 'src/environments/environment';
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
import { LoginComponent } from './login/login.component';
import { StatisticsService } from './services/statistics-service';
import { LocalStatisticsService } from './services/local-statistics-service';
import { UserService } from './services/user-service';

@NgModule({
  declarations: [
    AppComponent,
    StartGameComponent,
    NavMenuComponent,
    GameComponent,
    MainComponent,
    SavedGamesComponent,
    LoginComponent,
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
    SocialLoginModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleAuthClientId),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(environment.fbAuthClientId),
          },
        ],
      } as SocialAuthServiceConfig,
    },
    { provide: GameStorageService, useClass: LocalGameStorageService },
    { provide: StatisticsService, useClass: LocalStatisticsService },
    UserService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
