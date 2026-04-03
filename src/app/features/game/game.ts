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

  // Draw the initial hand for the player and calculate its value
  private nextHand(){
    this.state =  this.gameService.drawTiles(this.state);
    this.lastValue = this.gameService.calculateValue(
      this.state.playerHand, 
      this.state.nonNumberTileValues
    );
    this.state.playerPreviousHand = [];
  }

  // Handle player's prediction and update game state accordingly
  public predict(type: 'higher' | 'lower') {
    // Move current hand to discard pile and store it as previous hand
    this.state.discardPile.push(...this.state.playerHand);
    
    // Store the current hand as the previous hand before drawing new tiles
    this.state.playerPreviousHand = this.state.playerHand;

    const oldValue = this.lastValue;

    // 1. Draw new hand
    const newState = this.gameService.drawTiles(this.state);

    // 2. Calculate new value
    const newHandValue = this.gameService.calculateValue(
        newState.playerHand,
        newState.nonNumberTileValues
    );

    // 3. Determine win/loss
    const gameOutcome =
        (type === 'higher' && newHandValue > oldValue) ||
        (type === 'lower' && newHandValue < oldValue);

    // 4. Update tile values based on outcome
    const updatedState = this.gameService.updateTileValues(
        newState,
        newState.playerHand,
        gameOutcome
    );

    // 5. Check game over
    if (this.gameService.isGameOver(updatedState)) {
        updatedState.isGameOver = true;
    }
    // 6. Finally update state
    this.state = updatedState;
    this.lastValue = newHandValue;
  }
}
