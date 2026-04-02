import { Injectable } from '@angular/core';
import { GameState } from '../models/game-state.model';
import { DeckService } from './deck.service';
import { Tile } from '../models/tiles.model';
import { Console } from 'node:console';

@Injectable({ providedIn: 'root' })
export class GameService {
    constructor(private deckService: DeckService) {}


    public startNewGame(): GameState {
        return {
            drawPile : this.deckService.createDeck(),
            discardPile: [],
            playerHand: [],
            playerScore: 0,
            playerPreviousHand: [],
            nonNumberTileValues: {},
            shuffleCount: 0,
            isGameOver: false
        }
    }

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
            playerPreviousHand: [...gameState.playerPreviousHand, playerHand],
        };
    }

    updateTileValues(gameState: GameState, hand: Tile[], win: boolean): GameState {
        const nonNumberTileValues = { ...gameState.nonNumberTileValues };
        hand.forEach(t => {
            if (t.type !== 'number') {
                nonNumberTileValues[t.label] = win
                    ? (nonNumberTileValues[t.label] ?? 0) + 1
                    : (nonNumberTileValues[t.label] ?? 0) - 1;
            }
        });
        return { ...gameState, nonNumberTileValues };
    }

    calculateValue(hand: Tile[], dynamic: any): number {
        const result = hand.reduce((sum, t) => {
            if (t.type === 'number') return sum + t.value;
            const value = sum + (dynamic[t.label] ?? t.value);
            return value;
        }, 0);
        return result;
    }
}