import { Injectable } from '@angular/core';
import { GameState } from '../models/game-state.model';
import { DeckService } from './deck.service';
import { Tile } from '../models/tiles.model';

@Injectable({ providedIn: 'root' })
export class GameService {
    constructor(private deckService: DeckService) {}

    // Start a new game by creating a new deck and initializing the game state
    public startNewGame(): GameState {
        let deck = this.deckService.createDeck();
        let nonNumberTileValues: Record<string, number> = {};
        deck.forEach(tile => {
            if (tile.type !== 'number') {
                nonNumberTileValues[tile.label] = tile.value;
            }
        }); // Ensure unique IDs for all tiles
        
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

    // Draw 2 tiles for the player, reshuffling the discard pile back into the draw pile if necessary
    public drawTiles(gameState: GameState): GameState {
        let drawPile = [...gameState.drawPile];
        let discardPile = [...gameState.discardPile];

        if (drawPile.length < 2) {
            if (gameState.shuffleCount >= 2) {
                return { ...gameState, isGameOver: true };
            }

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

    // Update the values of non-number tiles based on whether the player's prediction was correct or not
    public updateTileValues(gameState: GameState, hand: Tile[], result: boolean): GameState {
        const nonNumberTileValues = { ...gameState.nonNumberTileValues };
        hand.forEach(t => {
            if (t.type !== 'number') {
                nonNumberTileValues[t.label] = result
                    ? (nonNumberTileValues[t.value] ?? 5) + 1
                    : (nonNumberTileValues[t.value] ?? 5) - 1;
                t.value = nonNumberTileValues[t.label];
            }
        });
        return { ...gameState, nonNumberTileValues };
    }


    public isGameOver(gameState: GameState): boolean {
        gameState.playerHand.forEach(t => {
            if (t.value <= 1 || t.value >= 9) {
                return true;
            }            
            return false;
        });
        return false;
    }

    public calculateValue(hand: Tile[], dynamic: any): number {
        const result = hand.reduce((sum, t) => {
            if (t.type === 'number') return sum + t.value;
            const value = sum + (dynamic[t.label] ?? t.value);
            return value;
        }, 0);
        return result;
    }
}