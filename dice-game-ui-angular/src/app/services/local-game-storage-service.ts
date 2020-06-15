import { GameStorageService } from './game-storage-service';
import { GameEngine, SimpleGameEngine } from '../../../../engine';

export class LocalGameStorageService implements GameStorageService {
         private gameEngine: GameEngine;

         saveGame(gameEngine: GameEngine): void {
           this.gameEngine = gameEngine;
           localStorage.setItem('field-size', gameEngine.fieldSize.toString());
         }

         restoreGame(): GameEngine {
           const fieldSizeStr = localStorage.getItem('field-size');
           let fieldSize: number = 0;
           try {
             fieldSize = parseInt(fieldSizeStr);
           } catch {
             throw new Error("Saved game wasn't found.");
           }
           if (!this.gameEngine) {
             this.gameEngine = new SimpleGameEngine(fieldSize, fieldSize);
           }

           return this.gameEngine;
         }

         removeSavedGame(gameEngine: GameEngine): void {
           this.gameEngine = null;
           localStorage.removeItem('field-size');
         }
       }
