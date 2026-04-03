import { Injectable } from '@angular/core';
import { Tile } from "../models/tiles.model";

@Injectable({ providedIn: 'root' })
export class DeckService {
    /**
     * Creates a standard deck of 64 Mahjong tiles, including number, dragon, and wind tiles.
     * Each number tile (1-9) appears 4 times, each dragon tile (Red, Green, White) appears 4 times,
     * and each wind tile (East, South, West, North) appears 4 times.
     * @returns {Tile[]} A shuffled array of Mahjong tiles.
     */
    public createDeck(): Tile[] {
        const tiles: Tile[] = [];
        
        // Create number tiles
        for (let i = 1; i <= 9; i++) {
            for (let j = 0; j < 4; j++) { // Each number tile appears 4 times
                tiles.push({ id: tiles.length, type: 'number', value: i, label: i.toString(), image: `character.png` });
            }
        }

        // Create dragon tiles
        const dragonColors = ['Red', 'Green', 'White'];
        dragonColors.forEach(color => {
            for (let j = 0; j < 4; j++) { // Each dragon tile appears 4 times
                tiles.push({ id: tiles.length, type: 'dragon', value: 5, label: `${color} Dragon`, image: `${color.toLowerCase().replace(/ /g, '-')}-dragon.png` });
            }
        });

        // Create wind tiles
        const windDirections = ['East', 'South', 'West', 'North'];
        windDirections.forEach(direction => {
            for (let j = 0; j < 4; j++) { // Each wind tile appears 4 times
                tiles.push({ id: tiles.length, type: 'wind', value: 5, label: `${direction}`, image: 'wind.png' });
            }
        });
        return this.shuffle(tiles);
    }

    /**
     * Shuffles the given deck of tiles using a random sort.
     * @param {Tile[]} deck - The deck of tiles to shuffle.
     * @returns {Tile[]} A new shuffled array of tiles.
     */
    public shuffle(deck: Tile[]): Tile[] {
        return [...deck].sort(() => Math.random() - 0.5);
    }
}
