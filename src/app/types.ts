export type Coords2D = {
    x: number;
    y: number;
};

export type Tile = {
    coords: Coords2D;
    value: number;
};

export type GridTile = Tile | null;

export type Grid = GridTile[][];
