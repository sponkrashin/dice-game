import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SimpleGameEngine } from 'engine';
import { GameStorageService } from '../services/game-storage-service';

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.scss'],
})
export class StartGameComponent implements OnInit {
  public size: number;
  public sizeOptions: number[] = [];

  constructor(private router: Router, private gameStorageService: GameStorageService) {}

  ngOnInit(): void {
    this.sizeOptions = [];
    for (let size = 6; size < 21; size++) {
      this.sizeOptions.push(size);
    }
  }

  startGame() {
    const newGame = new SimpleGameEngine(this.size, this.size);
    const gameGuid = this.gameStorageService.saveGame(newGame);
    this.router.navigate(['/game', gameGuid.toString()]);
  }
}
