import { Component, OnInit } from '@angular/core';

import { GameEngine } from 'engine';
import { GameStorageService } from '../services/game-storage-service';


@Component({
  selector: 'app-saved-games',
  templateUrl: './saved-games.component.html',
  styleUrls: ['./saved-games.component.scss'],
})
export class SavedGamesComponent implements OnInit {
  games: GameEngine[];

  constructor(private gameStorageService: GameStorageService) {}

  ngOnInit(): void {
    this.games = this.gameStorageService.getAllSavedGames();
  }
}
