import { Dice } from './dice';

export class SimpleDice implements Dice {
  constructor(private maxDiceValue: number) {}

  roll(): [number, number] {
    const firstDiceValue = Math.floor(Math.random() * this.maxDiceValue) + 1;
    const secondDiceValue = Math.floor(Math.random() * this.maxDiceValue) + 1;

    return [firstDiceValue, secondDiceValue];
  }
}
