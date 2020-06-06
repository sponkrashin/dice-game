import { Size } from './size';

export class Rect {
  readonly size: Size;

  constructor(readonly left: number, readonly top: number, width: number, height: number) {
    if (left < 0 || top < 0 || width <= 0 || height <= 0) {
      throw new Error('Rect position and size should be positive numbers');
    }

    this.size = { width, height };
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

    return new Rect(
      intersectLeft,
      intersectRight,
      intersectRight - intersectLeft + 1,
      intersectBottom - intersectTop + 1
    );
  }

  getIsTouched(rect: Rect): boolean {
    // Left and right edges
    for (let y = this.top; y < this.top + this.size.height; ++y) {
      if (rect.isPointInside(this.left - 1, y) || rect.isPointInside(this.left + this.size.width, y)) {
        return true;
      }
    }

    // Top and bottom edges
    for (let x = this.left; x < this.left + this.size.width; ++x) {
      if (rect.isPointInside(x, this.top - 1) || rect.isPointInside(x, this.top + this.size.height)) {
        return true;
      }
    }
  }

  private isPointInside(x: number, y: number): boolean {
    return this.left <= x && x < this.left + this.size.width && this.top <= y && y < this.top + this.size.height;
  }
}
