import { Injectable } from '@angular/core';
import { GameState } from '../models/game-state.model';
import { DeckService } from './deck.service';
import { Tile } from '../models/tiles.model';
import { Game } from '../../features/game/game';

@Injectable({ providedIn: 'root' })
export class GameService {
    constructor(private deckService: DeckService) {}

    /**
     * Starts a new game by creating a new deck, initializing non-number tile values,
     * and returning the initial game state.
     * @returns {GameState} The initialized game state for a new game.
     */
    startNewGame(): GameState {
        let deck = this.deckService.createDeck();
        let nonNumberTileValues: Record<string, number> = {};
        deck.forEach(tile => {
            if (tile.type !== 'number') {
                nonNumberTileValues[tile.label] = tile.value;
            }
        }); // Ensure unique IDs for all tiles
        console.log(deck);
        console.log(nonNumberTileValues);
        return {
            drawPile : deck,
            discardPile: [],
            playerHand: [],
            playerScore: 0,
            history: [],
            playerPreviousHand: [],
            nonNumberTileValues: nonNumberTileValues,
            shuffleCount: 0,
            isGameOver: false
        }
    }

    /**
     * Draws two tiles for the player. If the draw pile has fewer than two tiles,
     * reshuffles the discard pile and a new deck into the draw pile (up to two times).
     * Ends the game if no more tiles can be drawn after two shuffles.
     * @param {GameState} gameState - The current game state.
     * @returns {GameState} The updated game state after drawing tiles.
     */
    drawTiles(gameState: GameState): GameState {
        let drawPile = [...gameState.drawPile];
        let discardPile = [...gameState.discardPile];

        if (drawPile.length < 2) {
            drawPile =  this.deckService.shuffle([
                ...discardPile,
                ...this.deckService.createDeck()
            ]);
            
            discardPile = [];
            gameState.shuffleCount++;
        }

        const playerHand = drawPile.splice(0, 2);    

        return {
            ...gameState,
            drawPile,
            discardPile,
            playerHand: playerHand,
        };
    }

    /**
     * Updates the values of non-number tiles in the player's hand based on the result
     * of the player's prediction (correct or incorrect).
     * @param {GameState} gameState - The current game state.
     * @param {Tile[]} hand - The player's current hand.
     * @param {boolean} result - Whether the player's prediction was correct.
     * @returns {GameState} The updated game state with modified tile values.
     */
    updateTileValues(gameState: GameState, hand: Tile[], result: boolean): GameState {
        const nonNumberTileValues = { ...gameState.nonNumberTileValues };
        hand.forEach(t => {
            if (t.type !== 'number') {
                nonNumberTileValues[t.label] = result
                    ? (nonNumberTileValues[t.value] ?? 5) + 1
                    : (nonNumberTileValues[t.value] ?? 5) - 1;
                t.valueChange = nonNumberTileValues[t.label];
            }
        });
        return { ...gameState, nonNumberTileValues };
    }

    /**
     * Checks if the game is over based on the values of the player's hand.
     * The game ends if any tile value is 0 or 10.
     * @param {GameState} gameState - The current game state.
     * @returns {GameState} Returns false if the game is not over,
     * or an updated game state if the game is over.
     */
    isGameOver(gameState: GameState): GameState {
  for (const t of gameState.playerHand) {
    if (t.value === 0) {
      return {
        ...gameState,
        isGameOver: true,
        reason: "Player's tile value is too low"
      };
    }

    if (t.value === 10) {
      return {
        ...gameState,
        isGameOver: true,
        reason: "Player's tile value is too high"
      };
    }

    if(gameState.shuffleCount >= 0 && gameState.drawPile.length === 0) {
      return {
        ...gameState,
        isGameOver: true,
        reason: "No more tiles to draw"
      };
    }
  }

  return { ...gameState, isGameOver: false };
}

    /**
     * Calculates the total value of the player's hand, using dynamic values for non-number tiles.
     * @param {Tile[]} hand - The player's hand.
     * @param {any} dynamic - The current dynamic values for non-number tiles.
     * @returns {number} The total value of the hand.
     */
    calculateValue(hand: Tile[], dynamic: any): number {
        const result = hand.reduce((sum, t) => {
            if (t.type === 'number') return sum + t.value;
            let val = (t.valueChange !== undefined) ? t.valueChange : t.value;
            const value = sum + (dynamic[t.label] ?? val);
            return value;
        }, 0);
        return result;
    }
}