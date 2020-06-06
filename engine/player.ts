import { Rect } from './rect';

export interface Player {
  readonly playerId: string;
  readonly score: number;
  readonly rects: readonly Rect[];
}
