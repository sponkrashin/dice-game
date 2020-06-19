import { Component, OnInit } from '@angular/core';

import { Guid } from 'guid-typescript';

import { GameStorageService, SavedGameEngine } from '../services/game-storage-service';


@Component({
  selector: 'app-saved-games',
  templateUrl: './saved-games.component.html',
  styleUrls: ['./saved-games.component.scss'],
})
export class SavedGamesComponent implements OnInit {
  games: SavedGameEngine[];

  constructor(private gameStorageService: GameStorageService) {}

  ngOnInit(): void {
    this.games = this.gameStorageService.getAllSavedGames();
  }

  removeSavedGame(guid: Guid) {
    alert(guid);
    this.gameStorageService.removeGame(guid);
    this.games = this.gameStorageService.getAllSavedGames();
    alert(this.games);
  }
}
