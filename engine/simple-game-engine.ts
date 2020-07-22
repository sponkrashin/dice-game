import { GameEngine, GameEngineEventHandler } from './game-engine';
import { Size } from './size';
import { Player } from './player';
import { Rect } from './rect';
import { Dice } from './dice';
import { SimpleDice } from './simple-dice';

export interface SimpleGameEngineOptions {
  maxDiceValue: number;
}

const defaultOptions = { maxDiceValue: 6 } as SimpleGameEngineOptions;

export class SimpleGameEngine implements GameEngine {
  get state(): readonly (readonly boolean[])[] {
    return this.stateInternal;
  }

  /*get players(): readonly Player[] {
    const playerScore = this.rectsInternal.reduce((p, r) => p + r.getScore(), 0);
    return [{ playerId: null, score: playerScore, rects: this.rectsInternal }];
  }*/

  readonly players: readonly Player[];

  get rects(): readonly Rect[] {
    return this.rectsInternal;
  }

  get dices(): readonly Dice[] {
    return this.dicesInternal;
  }

  get isStarted(): boolean {
    return this.isGameStarted;
  }

  get isFinished(): boolean {
    return !this.isGameStarted;
  }

  readonly fieldSize: Size;

  private stateInternal: boolean[][];
  private rectsInternal: Rect[] = [];
  private readonly dicesInternal: Dice[];

  private isGameStarted = false;

  private onStateChangedEventHandlers: GameEngineEventHandler[] = [];
  private onGameFinishedEventHandlers: GameEngineEventHandler[] = [];

  constructor(fieldWidth: number, fieldHeight: number, playerId: string, options?: SimpleGameEngineOptions) {
    options = options ?? defaultOptions;
    this.fieldSize = { width: fieldWidth, height: fieldHeight };
    this.players = [{ playerId, score: 0, rects: this.rectsInternal }];
    this.dicesInternal = [new SimpleDice(options.maxDiceValue), new SimpleDice(options.maxDiceValue)];
  }

  startGame(): void {
    if (this.isGameStarted) {
      throw new Error('Game is already started');
    }

    this.initState(this.fieldSize);
    this.isGameStarted = true;
  }

  finishGame(): void {
    if (!this.isGameStarted) {
      throw new Error('Game is not started yet');
    }

    this.isGameStarted = false;

    this.onGameFinishedEventHandlers.forEach((handler) => handler(this));
  }

  addRect(userId: string, rect: Rect): void {
    if (!this.isGameStarted) {
      throw new Error('Game is not started yet');
    }

    if (rect.left + rect.size.width > this.fieldSize.width || rect.top + rect.size.height > this.fieldSize.height) {
      throw new Error('Rect is out of bounds');
    }

    const intersects = this.rectsInternal.some((existingRect) => !!existingRect.getIntersection(rect));

    if (intersects) {
      throw new Error('Rect is intersected with other rects and could not be added');
    }

    const touched = this.rectsInternal.some((existingRect) => !!existingRect.getIsTouched(rect));

    if (this.rectsInternal.length !== 0 && !touched) {
      throw new Error("Rect doesn't touch an existing rect and could not be added");
    }

    this.rectsInternal.push(rect);
    this.changeState(rect);

    const playerScore = this.rectsInternal.reduce((p, r) => p + r.getScore(), 0);
    this.players[0].score = playerScore;

    this.onStateChangedEventHandlers.forEach((handler) => handler(this));
  }

  skipTurn(userId: string): void {
    this.finishGame();
  }

  rollDices(): number[] {
    return this.dicesInternal.map((d) => d.roll());
  }

  registerOnStateChanged(handler: GameEngineEventHandler): void {
    if (!handler) {
      throw new Error('Handler should be defined');
    }

    this.onStateChangedEventHandlers.push(handler);
  }

  registerOnGameFinished(handler: GameEngineEventHandler): void {
    if (!handler) {
      throw new Error('Handler should be defined');
    }

    this.onGameFinishedEventHandlers.push(handler);
  }

  private initState(fieldSize: Size) {
    this.stateInternal = [];

    for (let x = 0; x < fieldSize.width; ++x) {
      this.stateInternal.push([]);

      for (let y = 0; y < fieldSize.height; ++y) {
        this.stateInternal[x].push(false);
      }
    }
  }

  private changeState(rect: Rect): void {
    for (let x = rect.left; x < rect.left + rect.size.width; ++x) {
      for (let y = rect.top; y < rect.top + rect.size.height; ++y) {
        this.stateInternal[y][x] = true; // Indices are inverted, first index relates to Y-axis, second - to X-axis
      }
    }
  }
}
