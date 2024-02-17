export type Coords2D = {
    x: number;
    y: number;
};

export interface Tile extends Coords2D {
    id: string;
    value: number;
    mergedFrom?: [Coords2D, Coords2D] | null;
};

export type MoveDirection = 'up' | 'down' | 'left' | 'right';

export type GridTile = Tile | null;

export type Grid = GridTile[][];

export type Traversals = {
    x: number[],
    y: number[],
};
