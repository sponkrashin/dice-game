import { Component, OnInit, HostListener } from '@angular/core';
import * as d3 from 'd3';

import { SimpleGameEngine, SimpleDice, Rect } from '../../../../engine';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  private el: HTMLElement; // div for game field

  public fieldSize = 0;
  public canvasWidth = 600;
  public elWidth = 0;
  public gameEngine;
  public simpleDice;

  public points: FieldPoint[] = [];

  public selecting = false;
  public svg = null;
  public startPoint: FieldPoint = null;

  public dice1 = 0;
  public dice2 = 0;

  public gameFinished = false;
  public score = 0;

  constructor() {
    const storageFieldSize = localStorage.getItem('field-size');
    if (storageFieldSize) {
      this.fieldSize = Number(storageFieldSize);
    } else {
      this.fieldSize = 20;
    }

    this.gameEngine = new SimpleGameEngine(this.fieldSize, this.fieldSize);
    this.simpleDice = new SimpleDice(6);

    this.gameEngine.registerOnStateChanged((engine) => {
      this.gameEngine = engine;
      this.score = engine.players[0].score;
      this.points = this.castData();
      this.render_field();
    });

    this.gameEngine.registerOnGameFinished((engine) => (this.gameFinished = true));

    this.gameEngine.startGame();
  }

  ngOnInit(): void {
    this.svg = d3.select('#canv');
    this.points = this.castData();
    this.render_field();
  }

  /// get actual size of div for the game field
  @HostListener('window:resize', ['$event.target'])
  onResize() {
    this.canvasWidth = parseInt(this.el.getAttribute('actual-width'), 10);
    this.render_field();
  }
  ////

  public roll_dices() {
    const dices = this.simpleDice.roll();
    this.dice1 = dices[0];
    this.dice2 = dices[1];
    if (!this.fieldHasPlace()) {
      this.gameEngine.finishGame();
    }

    this.points = this.castData();
    this.render_field();
  }

  public fieldHasPlace(): boolean {
    return true;
  }

  public castData(): FieldPoint[] {
    const points: FieldPoint[] = [];
    for (let i = 0; i < this.gameEngine.fieldSize.width; i++) {
      for (let j = 0; j < this.gameEngine.fieldSize.height; j++) {
        points.push({
          x: i,
          y: j,
          selected: false,
          set: this.gameEngine.state[i][j]
        });
      }
    }
    return points;
  }

  public render_field() {
    // this.svg.node().getBoundingClientRect().width;
    const rectSide = this.canvasWidth / this.fieldSize;
    const border = rectSide * 0.01;
    // add
    this.svg
      .selectAll('rect')
      .data(this.points)
      .enter()
      .append('rect')
      .attr('x', (d) => {
        return d.x * rectSide + d.x * border;
      })
      .attr('y', (d) => {
        return d.y * rectSide + d.y * border;
      })
      .attr('height', rectSide)
      .attr('width', rectSide)
      .attr('data-point-x', (d) => {
        return d.x;
      })
      .attr('data-point-y', (d) => {
        return d.y;
      })
      .on('mousedown', (d, i, nodes) => {
        if (this.dice1 < 1 || this.dice2 < 1) {
          return;
        }
        this.selecting = true;
        const pointElement = d3.select(nodes[i]);
        pointElement.style('fill', 'blue');
        this.startPoint = {
          x: parseInt(pointElement.attr('data-point-x'), 10),
          y: parseInt(pointElement.attr('data-point-y'), 10),
          set: false,
          selected: false
        };
        this.render_field();
      })
      .on('mouseup', (d, i, nodes) => {
        const pointElement = d3.select(nodes[i]);
        const selectedRect = this.select_area(pointElement);
        this.selecting = false;

        if (this.isFullRect(selectedRect)) {
          try {
            this.gameEngine.addRect(null, selectedRect);
            this.dice1 = 0;
            this.dice2 = 0;
          } catch (ex) {
            alert(ex);
            this.clearSelection();
          }
        } else {
          alert(`Selected area is not equal to ${this.dice1} by ${this.dice2}`);
          this.clearSelection();
        }

        this.startPoint = null;
      })
      .on('mouseover', (d, i, nodes) => {
        const rect = d3.select(nodes[i]);
        this.select_area(rect);
      })
      .style('fill', 'lightblue');

    // update
    this.svg
      .selectAll('rect')
      .data(this.points)
      .style('fill', (d) => {
        if (d.set === true) {
          return 'red';
        } else if (d.selected === true) {
          return 'blue';
        } else {
          return 'lightblue';
        }
      });

    // delete
    this.svg.selectAll('rect').data(this.points).exit().remove();
  }

  public clearSelection(){
    for (const point of this.points){
      point.selected = false;
    }
    this.render_field();
  }

  public isFullRect(rect: Rect): boolean {
    const selectedPointsCount = this.points.filter((x) => x.selected).length;
    return selectedPointsCount === this.dice1 * this.dice2;
  }

  public select_area(pointElement): Rect {
    if (this.selecting) {
      pointElement.style('fill', 'blue');
      return this.set_neighbors(this.startPoint, {
        x: parseInt(pointElement.attr('data-point-x'), 10),
        y: parseInt(pointElement.attr('data-point-y'), 10),
        selected: false,
        set: false
      });
    }
    return null;
  }

  public set_neighbors(startPoint: FieldPoint, endPoint: FieldPoint): Rect {
    if (startPoint == null) {
      return;
    }
    let d1 = this.dice1;
    let d2 = this.dice2;
    let minX = Math.min(startPoint.x, endPoint.x);
    let minY = Math.min(startPoint.y, endPoint.y);
    let maxX = Math.max(startPoint.x, endPoint.x);
    let maxY = Math.max(startPoint.y, endPoint.y);
    const lenX = Math.abs(minX - maxX) + 1;
    const lenY = Math.abs(minY - maxY) + 1;

    // Change dices in accordance with available length
    if (Math.abs(d2 - lenX) < Math.abs(d1 - lenX)) {
      const curD = d2;
      d2 = d1;
      d1 = curD;
    }
    // Limit width by dice value
    if (lenX >= d1) {
      if (minX === startPoint.x) {
        maxX -= lenX - d1;
      } else {
        minX += lenX - d1;
      }
    }
    // Limit height by dice value
    if (lenY >= d2) {
      if (minY === startPoint.y) {
        maxY -= lenY - d2;
      } else {
        minY += lenY - d2;
      }
    }
    // Set selection for points
    for (const point of this.points) {
      if (point.x <= maxX && point.x >= minX && point.y <= maxY && point.y >= minY) {
        point.selected = true;
      } else {
        point.selected = false;
      }
    }

    this.render_field();
    return new Rect(minY, minX, maxY - minY + 1, maxX - minX + 1); // inverted axis!!
  }
}

interface FieldPoint {
  readonly x: number;
  readonly y: number;
  selected: boolean;
  set: boolean;
}
