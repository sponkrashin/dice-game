import { Dice } from './dice';

export class SimpleDice implements Dice {
  constructor(private maxDiceValue: number) {}

  roll(): number {
    return Math.floor(Math.random() * this.maxDiceValue) + 1;
  }
}
