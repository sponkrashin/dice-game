import { SimpleGameEngine, Rect, SimpleDice } from 'engine';

const engine = new SimpleGameEngine(10, 10);

const positionDices = [new SimpleDice(10), new SimpleDice(10)];

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
  if (engine.isFinished) {
    break;
  }

  const position = positionDices.map((d) => d.roll());
  const size = engine.rollDices();

  const newRect = new Rect(position[0] - 1, position[1] - 1, size[0], size[1]);
  console.log(newRect);

  const isIntersected = engine.rects.length !== 0 && engine.rects.some((r) => r.getIntersection(newRect));
  const isTouched = engine.rects.length === 0 || engine.rects.some((r) => r.getIsTouched(newRect));

  if (isIntersected || !isTouched) {
    console.log('Cannot place such rect, skipping turn');
    engine.skipTurn(null);
  } else {
    engine.addRect(null, newRect);
  }
}

if (!engine.isFinished) {
  engine.finishGame();
}
