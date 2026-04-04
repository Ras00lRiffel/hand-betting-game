import { Component } from '@angular/core';
import { GameState } from '../../core/models/game-state.model';
import { GameService } from '../../core/services/game.service';
import { RouterLink } from "@angular/router";
import { Tile } from '../../core/models/tiles.model';

@Component({
  selector: 'app-game',
  imports: [RouterLink],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game {
  public state: GameState;
  public lastValue = 0;
  public topFiveScores: { tile: Tile[]; score: number }[] = [];

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

  // 1. Store previous hand + value
  const previousHand = [...this.state.playerHand];
  const oldValue = this.lastValue;

  // 2. Move to discard
  this.state.discardPile.push(...previousHand);
  this.state.playerPreviousHand = previousHand;

  // 3. Draw new hand
  const newState = this.gameService.drawTiles(this.state);

  // 4. Calculate new value (BEFORE scaling)
  const newHandValue = this.gameService.calculateValue(
    newState.playerHand,
    newState.nonNumberTileValues
  );

  // 5. Determine win/loss
  const gameOutcome =
    (type === 'higher' && newHandValue > oldValue) ||
    (type === 'lower' && newHandValue < oldValue);
  
  if (gameOutcome) {
    newState.gameOutcome = 'win';
  } else {
    newState.gameOutcome = 'lose';
  }

  // 6. NOW update tile values
  let updatedState = this.gameService.updateTileValues(
    newState,
    newState.playerHand,
    gameOutcome
  );

  // 7. Check game over
  updatedState = this.gameService.isGameOver(updatedState);

  // 8. Store score (use correct hand!)
  this.topFiveScores.push({
    tile: previousHand,
    score: oldValue
  });

  this.topFiveScores.sort((a, b) => b.score - a.score);
  this.topFiveScores = this.topFiveScores.slice(0, 5);

  // 9. Update state
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
