import { GameEngine, GameEngineEventHandler } from './game-engine';
import { Size } from './size';
import { Player } from './player';
import { Rect } from './rect';

export class SimpleGameEngine implements GameEngine {
  get state(): readonly (readonly boolean[])[] {
    return this.stateInternal;
  }

  get players(): readonly Player[] {
    const playerScore = this.rectsInternal.reduce((p, r) => p + r.getValue(), 0);
    return [{ playerId: null, score: playerScore }];
  }

  get rects(): readonly Rect[] {
    return this.rectsInternal;
  }

  private stateInternal: boolean[][];
  private rectsInternal: Rect[] = [];

  private isGameStarted = false;

  private onStateChangedEventHandlers: GameEngineEventHandler[] = [];
  private onGameFinishedEventHandlers: GameEngineEventHandler[] = [];

  constructor(public readonly fieldSize: Size) {}

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

    const intersects = this.rectsInternal.some((existingRect) => !!existingRect.getIntersection(rect));

    if (intersects) {
      throw new Error('Rect is intersected with other rects and could not be added');
    }

    this.rectsInternal.push(rect);
    this.changeState(rect);

    this.onStateChangedEventHandlers.forEach((handler) => handler(this));
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
        this.stateInternal[x][y] = true;
      }
    }
  }
}
