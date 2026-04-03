import { Tile } from './tiles.model';

export interface GameState {
    // The current draw pile of tiles
    drawPile: Tile[];
    // To track discarded tiles for potential future use (e.g., reshuffling)
    discardPile: Tile[];
    // To track the history of played tiles
    history: Tile[];
    // The current hand of the player
    playerHand: Tile[]; 
    // For undo functionality
    playerPreviousHand: Tile[];
    // To track the player's score based on the tiles in hand
    playerScore: number; 
    // To track the values of dragon and wind tiles
    nonNumberTileValues: Record<string, number>; 
    // To track how many times the player has shuffled the draw pile
    shuffleCount: number;
    // To track if the player has won or lost the game
    isGameOver: boolean;
    // Optional reason for game over (e.g., "No more tiles to draw")
    reason?: string;
}
