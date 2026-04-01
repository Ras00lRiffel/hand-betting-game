export interface Tile {
    // Unique identifier for each tile
    id: number;
    // The type of the tile (number, dragon, wind)
    type: TileType;
    // The numeric value of the tile (1-9 for number tiles, special values for dragon/wind tiles)
    value: number;
    // The label for the tile (e.g., "1", "East Wind", "Red Dragon")
    label: string;
}

export type TileType = 'number' | 'dragon' | 'wind';
