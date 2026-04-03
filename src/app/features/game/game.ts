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

  /**
   * Initializes the Game component, sets up the initial game state,
   * and draws the first hand.
   * @param gameService The service handling game logic and state.
   */
  constructor(private gameService: GameService) {
    // Initialize game state
    this.state = this.gameService.startNewGame();
    this.nextHand();
  }

  /**
   * Draws the next hand for the player, calculates its value,
   * and resets the previous hand.
   */
  nextHand() {
    this.state = this.gameService.drawTiles(this.state);
    this.lastValue = this.gameService.calculateValue(
      this.state.playerHand,
      this.state.nonNumberTileValues
    );
    this.state.playerPreviousHand = [];
  }

  /**
   * Handles the player's prediction (higher or lower), updates the game state,
   * calculates the outcome, updates tile values, checks for game over,
   * and updates the last hand value.
   * @param type The player's prediction: 'higher' or 'lower'.
   */
  predict(type: 'higher' | 'lower') {
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

  /**
   * Restarts the game by resetting the state and drawing a new hand.
   */
  restart() {
    this.state = this.gameService.startNewGame();
    this.state.shuffleCount = 0;
    this.nextHand();
  }
}
