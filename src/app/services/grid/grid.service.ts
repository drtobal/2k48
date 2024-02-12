import { Injectable } from '@angular/core';
import { DEFAULT_NEW_TILE } from '../../constants';
import { Coords2D, Grid, GridTile } from '../../types';

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
        coords: tile,
        value: this.getRandom(DEFAULT_NEW_TILE),
      };
    }
    return grid;
  }

  getRandom<T>(arr: T[]): T {
    const length = arr.length;
    if (length <= 1) {
      return arr[0];
    }

    return arr[this.getRandomInRange(0, length - 1)];
  }

  getRandomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

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
}
