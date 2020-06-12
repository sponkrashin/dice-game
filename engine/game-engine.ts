import { Size } from './size';
import { Player } from './player';
import { Rect } from './rect';
import { Dice } from './dice';

export type GameEngineEventHandler = (engine: GameEngine) => void;

export interface GameEngine {
  readonly state: readonly (readonly boolean[])[];
  readonly fieldSize: Size;
  readonly players: readonly Player[];
  readonly rects: readonly Rect[];
  readonly dices: readonly Dice[];

  startGame(): void;
  finishGame(): void;
  addRect(userId: string, rect: Rect): void;
  skipTurn(userId: string): void;
  rollDice(): number[];

  registerOnStateChanged(handler: GameEngineEventHandler): void;
  registerOnGameFinished(handler: GameEngineEventHandler): void;
}
