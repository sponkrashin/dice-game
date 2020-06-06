import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.scss'],
  
})

export class StartGameComponent implements OnInit {

  size: number;
  size_options: number[];

  constructor() { 
    this.size_options = [15, 16, 17, 18, 19, 20];
  }

  ngOnInit(): void {
  }

}
