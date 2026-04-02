import { Component } from '@angular/core';
import { GameState } from '../../core/models/game-state.model';
import { GameService } from '../../core/services/game.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-game',
  imports: [RouterLink],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game {
  public state: GameState;
  public lastValue = 0;

  constructor(private gameService: GameService) {
    // Initialize game state
    this.state = this.gameService.startNewGame();
    this.nextHand();
  }

  nextHand(){
    this.state =  this.gameService.drawTiles(this.state);
    this.lastValue = this.gameService.calculateValue(
      this.state.playerHand, 
      this.state.nonNumberTileValues
    );
  }

  predict(type: 'higher' | 'lower') {
  const oldValue = this.lastValue;

  // 1. Draw new hand
  const newState = this.gameService.drawTiles(this.state);

  // 2. Calculate new value
  const newHandValue = this.gameService.calculateValue(
    newState.playerHand,
    newState.nonNumberTileValues
  );

  // 3. Determine win/loss
  const win =
    (type === 'higher' && newHandValue > oldValue) ||
    (type === 'lower' && newHandValue < oldValue);

  // 4. Update tile values (VERY IMPORTANT)
  const updatedState = this.gameService.updateTileValues(
    newState,
    newState.playerHand,
    win
  );

  // 5. Update score
  updatedState.score += win ? 1 : -1;

  // 6. Check game over
  if (this.gameService.isGameOver(updatedState)) {
    updatedState.gameOver = true;
  }

  // 7. Finally update state
  this.state = updatedState;
  this.lastValue = newHandValue;
}
}
