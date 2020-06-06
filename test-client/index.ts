import { SimpleGameEngine, Rect, SimpleDice } from 'engine';

const engine = new SimpleGameEngine(10, 10);

const positionDice = new SimpleDice(10);
const sizeDice = new SimpleDice(6);

engine.registerOnStateChanged((engine) => {
  engine.state.forEach((row) => {
    const rowString = row.map((r) => (r ? 'X' : '-')).join('');
    console.log(rowString);
  });

  console.log();
});

engine.registerOnGameFinished((engine) => console.log(engine.players));

engine.startGame();

for (let i = 0; i < 10; ++i) {
  const position = positionDice.roll();
  const size = sizeDice.roll();

  const newRect = new Rect(position[0] - 1, position[1] - 1, size[0], size[1]);
  console.log(newRect);

  try {
    engine.addRect(null, newRect);
  } catch (err) {
    console.log(err.message);
  }
}

engine.finishGame();
