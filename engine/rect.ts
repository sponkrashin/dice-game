import { Size } from './size';

export class Rect {
  constructor(public readonly left: number, public readonly top: number, public readonly size: Size) {
    if (left < 0 || top < 0 || size.width <= 0 || size.height <= 0) {
      throw new Error('Rect position and size should be positive numbers');
    }
  }

  getScore(): number {
    return this.size.width * this.size.height;
  }

  getIntersection(rect: Rect): Rect {
    const minLeft = Math.min(this.left, rect.left);
    const minTop = Math.min(this.top, rect.top);
    const maxRight = Math.max(this.left + this.size.width, rect.left + rect.size.width);
    const maxBottom = Math.max(this.top + this.size.height, rect.top + rect.size.height);

    let intersectLeft = -1;
    let intersectRight = -1;
    let intersectTop = -1;
    let intersectBottom = -1;

    for (let x = minLeft; x < maxRight; ++x) {
      for (let y = minTop; y < maxBottom; ++y) {
        if (this.isPointInside(x, y) && rect.isPointInside(x, y)) {
          if (intersectLeft === -1) {
            intersectLeft = x;
            intersectRight = x;
            intersectTop = y;
            intersectBottom = y;
          } else {
            intersectRight = Math.max(intersectRight, x);
            intersectBottom = Math.max(intersectBottom, y);
          }
        }
      }
    }

    if (intersectLeft === -1) {
      return null;
    }

    return new Rect(intersectLeft, intersectRight, {
      width: intersectRight - intersectLeft + 1,
      height: intersectBottom - intersectTop + 1,
    });
  }

  private isPointInside(x: number, y: number): boolean {
    return this.left <= x && x < this.left + this.size.width && this.top <= y && y < this.top + this.size.height;
  }
}
