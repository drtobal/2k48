import { Injectable } from '@angular/core';
import { DEFAULT_NEW_TILE } from '../../constants';
import { Coords2D, Grid, GridTile, MoveDirection, Tile, Traversals } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class GridService {

  newGrid(size: number): Grid {
    const grid: Grid = [];
    for (let x = 0; x < size; x++) {
      const row: GridTile[] = [];
      for (let y = 0; y < size; y++) {
        row.push(null);
      }
      grid.push(row);
    }
    return grid;
  }

  addNewTile(grid: Grid): Grid {
    const freeTiles = this.freeTiles(grid);
    if (freeTiles.length > 0) {
      const tile = this.getRandom(freeTiles);
      grid[tile.x][tile.y] = {
        ...tile,
        value: this.getRandom(DEFAULT_NEW_TILE),
      };
    }
    return grid;
  }

  getRandom<T>(arr: T[]): T {
    const length = arr.length;
    if (length <= 1) return arr[0];

    return arr[Math.floor(Math.random() * length)];
  }

  // getRandomInRange(max: number, min: number = 0) {
  //   return Math.random() * (max - min) + min;
  // }

  freeTiles(grid: Grid): Coords2D[] {
    const emptyTiles: Coords2D[] = [];
    this.forTiles(grid, (x, y, tile) => {
      if (tile === null) {
        emptyTiles.push({ x, y });
      }
    })
    return emptyTiles;
  }

  forTiles(grid: Grid, cb: (x: number, y: number, tile: GridTile) => void): void {
    const gridSize = grid.length; // grids should always be squares
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        cb(x, y, grid[x][y]);
      }
    }
  }

  moveTile(grid: Grid, direction: MoveDirection): Grid {
    let moved: boolean = false;
    const gridSize = grid.length;
    const vector = this.getVectorDirection(direction);
    const traversals = this.buildTraversals(vector, gridSize);

    grid = this.clearMoveInformation(grid);

    traversals.x.forEach(x => {
      traversals.y.forEach(y => {
        const coords: Coords2D = { x, y };
        const tile = grid[coords.x][coords.y];
        if (tile) {
          const positions = this.findFarthestPosition(coords, vector, grid);

          // Only one merger per row traversal?
          if (positions.next && positions.next.value === tile.value && !positions.next.mergedFrom) {
            const merged: Tile = {
              ...positions.next,
              value: tile.value * 2,
              mergedFrom: [tile, positions.next],
            };

            grid[tile.x][tile.y] = null;
            grid[merged.x][merged.y] = merged;
            tile.x = positions.next.x;
            tile.y = positions.next.y;

            // here check the score and check if game is won
          } else { // move tile
            grid[tile.x][tile.y] = null;
            tile.x = positions.farthest.x;
            tile.y = positions.farthest.y;
            grid[tile.x][tile.y] = tile;
          }

          if (coords.x !== tile.x || coords.y !== tile.y) {
            moved = true;
          }
        }
      });
    });

    if (moved) {
      grid = this.addNewTile(grid);
      // check game over if there are no more free tiles
    }

    return grid;
  }

  clearMoveInformation(grid: Grid): Grid {
    const size = grid.length;
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        if (grid[x][y]) {
          grid[x][y]!.mergedFrom = null;
        }
      }
    }
    return grid;
  }

  getVectorDirection(direction: MoveDirection): Coords2D {
    switch (direction) {
      case 'down': return { x: 0, y: 1 };
      case 'left': return { x: -1, y: 0 };
      case 'right': return { x: 1, y: 0 };
      case 'up': return { x: 0, y: -1 };
    }
  }

  findFarthestPosition(coords: Coords2D, vector: Coords2D, grid: Grid): { farthest: Coords2D, next: GridTile } {
    const gridSize = grid.length;
    let previous: Coords2D;

    // Progress towards the vector direction until an obstacle is found
    do {
      previous = coords;
      coords = { x: previous.x + vector.x, y: previous.y + vector.y };

    } while (this.withinBounds(coords, gridSize) && grid[coords.x][coords.y] === null);

    return {
      farthest: previous,
      next: this.withinBounds(coords, gridSize) ? grid[coords.x][coords.y] : null,
    };
  }

  withinBounds(position: Coords2D, size: number): boolean {
    return position.x >= 0 && position.x < size && position.y >= 0 && position.y < size;
  }

  buildTraversals(vector: Coords2D, size: number): Traversals {
    const traversals: Traversals = { x: [], y: [] };

    for (let pos = 0; pos < size; pos++) {
      traversals.x.push(pos);
      traversals.y.push(pos);
    }

    // Always traverse from the farthest cell in the chosen direction
    if (vector.x === 1) traversals.x = traversals.x.reverse();
    if (vector.y === 1) traversals.y = traversals.y.reverse();

    return traversals;
  }
}
