import { SimpleGameEngine, Rect } from 'engine';

const engine = new SimpleGameEngine({ width: 5, height: 5 });

engine.registerOnStateChanged((engine) => console.log(engine.players));

engine.startGame();

engine.addRect(null, new Rect(0, 0, { width: 2, height: 2 }));
engine.addRect(null, new Rect(3, 3, { width: 1, height: 3 }));
