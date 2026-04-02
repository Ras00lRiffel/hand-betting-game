import { Injectable } from '@angular/core';
import { Tile } from "../models/tiles.model";

@Injectable({ providedIn: 'root' })
export class DeckService {
    // Method to create a standard deck of 64 Mahjong tiles
    public createDeck(): Tile[] {
        const tiles: Tile[] = [];
        
        // Create number tiles
        for (let i = 1; i <= 9; i++) {
            for (let j = 0; j < 4; j++) { // Each number tile appears 4 times
                tiles.push({ id: tiles.length, type: 'number', value: i, label: i.toString() });
            }
        }

        // Create dragon tiles
        const dragonColors = ['Red', 'Green', 'White'];
        dragonColors.forEach(color => {
            for (let j = 0; j < 4; j++) { // Each dragon tile appears 4 times
                tiles.push({ id: tiles.length, type: 'dragon', value: 5, label: `${color} Dragon` });
            }
        });

        // Create wind tiles
        const windDirections = ['East', 'South', 'West', 'North'];
        windDirections.forEach(direction => {
            for (let j = 0; j < 4; j++) { // Each wind tile appears 4 times
                tiles.push({ id: tiles.length, type: 'wind', value: 5, label: `${direction} Wind` });
            }
        });
        return this.shuffle(tiles);
    }

    public shuffle(deck: Tile[]): Tile[] {
        return [...deck].sort(() => Math.random() - 0.5);
    }
}
