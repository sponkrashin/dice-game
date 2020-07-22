import { Rect } from './rect';

export interface Player {
  readonly playerId: string;
  score: number;
  readonly rects: readonly Rect[];
}
