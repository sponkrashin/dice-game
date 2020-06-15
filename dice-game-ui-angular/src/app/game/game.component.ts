import { Component, OnInit, HostListener } from '@angular/core';
import * as d3 from 'd3';

import { SimpleDice, GameEngine, Dice, Rect, Size } from 'engine';
import { GameStorageService } from '../services/game-storage-service';
import { LocalGameStorageService } from '../services/local-game-storage-service';

interface FieldPoint {
  readonly x: number;
  readonly y: number;
  selected: boolean;
  set: boolean;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  providers: [{ provide: GameStorageService, useClass: LocalGameStorageService }],
})
export class GameComponent implements OnInit {
  private readonly setColor: string = '#D28EFF';
  private readonly selectedColor: string = '#3f51b5';
  private readonly emptyColor: string = 'lightblue';
  private canvasMaxHeight = 600;

  private gameEngine: GameEngine;
  private simpleDice: Dice;

  private points: FieldPoint[] = [];

  private selecting = false;
  private svg = null;
  private startPoint: FieldPoint = null;

  public dice1 = 0;
  public dice2 = 0;
  public gameFinished = false;
  public score = 0;

  constructor(private gameStorageService: GameStorageService) {
    this.simpleDice = new SimpleDice(6);
    try {
      this.gameEngine = gameStorageService.restoreGame();
    } catch {
      throw new Error('The game was not started.');
    }

    if (this.gameEngine) {
      this.gameEngine.registerOnStateChanged((engine) => {
        gameStorageService.saveGame(this.gameEngine);
        this.score = engine.players[0].score;
        this.points = this.castData();
        this.render_field();
      });

      this.gameEngine.registerOnGameFinished((engine) => {
        this.gameFinished = true;
        gameStorageService.removeSavedGame(this.gameEngine);
      });

      this.gameEngine.startGame();
    }
  }

  ngOnInit(): void {
    this.svg = d3.select('#canv');
    // fixed issues with actions outside svg element
    d3.select('body').on('mouseup', () => {
      this.clearSelection();
      this.startPoint = null;
      this.selecting = false;
    });
    if (this.gameEngine) {
      this.points = this.castData();
      this.render_field();
    }
  }

  /// get actual size of div for the game field
  @HostListener('window:resize', ['$event.target'])
  onResize() {
    this.svg.selectAll('rect').remove();
    this.render_field();
  }

  public rollDices() {
    const dices = this.simpleDice.roll();
    this.dice1 = dices[0];
    this.dice2 = dices[1];
    if (!this.fieldHasPlace()) {
      this.gameEngine.finishGame();
    }

    this.points = this.castData();
    this.render_field();
  }

  private fieldHasPlace(): boolean {
    let resRects: Size[] = [];
    for (let row = 0; row < this.gameEngine.fieldSize.height; row++) {
      for (let col = 0; col < this.gameEngine.fieldSize.width; col++) {
        if (!this.gameEngine.state[col][row]) {
          const fieldWidth = this.gameEngine.fieldSize.width;
          const fieldHeight = this.gameEngine.fieldSize.height;
          const curRect = this.findFreeRect(col, fieldWidth, row, fieldHeight, this.gameEngine.state);
          resRects = resRects.concat(curRect);
        }
      }
    }
    const filtered = resRects.filter(
      (i) => (this.dice1 <= i.height && this.dice2 <= i.width) || (this.dice1 <= i.width && this.dice2 <= i.height)
    );
    return filtered.length > 0;
  }

  private findFreeRect(
    startColIndex,
    endColIndex,
    startRowIndex,
    endRowIndex,
    state: readonly (readonly boolean[])[],
    curHeight = 0,
    curWidth = 0
  ): Size[] {
    let resRects: Size[] = [];
    if (startColIndex === endColIndex || startRowIndex === endRowIndex) {
      return resRects;
    }
    if (curWidth === 0) {
      for (let col = startColIndex; col < endColIndex; col++) {
        if (state[col][startRowIndex]) {
          endColIndex = col;
          break;
        }
      }
      curWidth = endColIndex - startColIndex;
      curHeight = 1;
      startRowIndex++;
    }
    for (let row = startRowIndex; row < endRowIndex; row++) {
      let isBroken = false;
      for (let col = startColIndex; col < endColIndex; col++) {
        if (state[col][row]) {
          resRects.push({ height: curHeight, width: curWidth });
          resRects = resRects.concat(
            this.findFreeRect(startColIndex, col, row + 1, endRowIndex, state, curHeight, col - startColIndex)
          );
          isBroken = true;
          break;
        }
      }
      if (isBroken) {
        break;
      }
      curHeight++;
    }
    resRects.push({ height: curHeight, width: curWidth });
    return resRects;
  }

  public castData(): FieldPoint[] {
    const points: FieldPoint[] = [];
    for (let i = 0; i < this.gameEngine.fieldSize.width; i++) {
      for (let j = 0; j < this.gameEngine.fieldSize.height; j++) {
        points.push({
          x: i,
          y: j,
          selected: false,
          set: this.gameEngine.state[i][j],
        });
      }
    }
    return points;
  }

  public render_field() {
    const svgWidth = this.svg.node().getBoundingClientRect().width;
    const newWidth = Math.min(svgWidth, this.canvasMaxHeight);
    const margin = (svgWidth - newWidth) / 2;
    const rectSide = newWidth / this.gameEngine.fieldSize.width;
    const border = rectSide * 0.01;
    // add
    this.svg
      .selectAll('rect')
      .data(this.points)
      .enter()
      .append('rect')
      .attr('x', (d) => {
        return margin + d.x * rectSide + d.x * border;
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
        const pointElement = d3.select(nodes[i]);

        this.selecting = true;
        this.startPoint = {
          x: parseInt(pointElement.attr('data-point-x'), 10),
          y: parseInt(pointElement.attr('data-point-y'), 10),
          set: false,
          selected: true,
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
            if (this.gameEngine.state.reduce((prev, next) => prev.concat(next)).filter((c) => !c).length === 0) {
              this.gameEngine.finishGame();
            }
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
      .style('fill', this.emptyColor);

    // update
    this.svg
      .selectAll('rect')
      .data(this.points)
      .style('fill', (d) => {
        if (d.set === true) {
          return this.setColor;
        } else if (d.selected === true) {
          return this.selectedColor;
        } else {
          return this.emptyColor;
        }
      });

    // delete
    this.svg.selectAll('rect').data(this.points).exit().remove();
  }

  public clearSelection() {
    for (const point of this.points) {
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
      pointElement.style('fill', this.selectedColor);
      return this.set_neighbors(this.startPoint, {
        x: parseInt(pointElement.attr('data-point-x'), 10),
        y: parseInt(pointElement.attr('data-point-y'), 10),
        selected: false,
        set: false,
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
