import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.scss'],
})
export class StartGameComponent implements OnInit {

  public size: number;
  public sizeOptions: number[] = [];

  constructor(private router: Router) {
    for (let size = 6; size < 21; size++) {
      this.sizeOptions.push(size);
    }
  }

  ngOnInit(): void {}

  startGame(){
    localStorage.setItem('field-size', this.size.toString());
    this.router.navigate(['/game']);
  }
}
