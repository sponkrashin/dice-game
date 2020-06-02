import { Size } from './size';

export class Rect {
  constructor(public readonly top: number, public readonly left: number, public readonly size: Size) {}

  getIntersection(rect: Rect): Rect {
    throw new Error('Method not implemented');
  }
}
