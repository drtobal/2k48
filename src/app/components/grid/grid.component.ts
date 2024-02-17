import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, PLATFORM_ID } from '@angular/core';
import { DEFAULT_GRID_SIZE } from '../../constants';
import { GridService } from '../../services/grid/grid.service';
import { UtilService } from '../../services/util/util.service';
import { Grid, MoveDirection, Tile } from '../../types';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent {
  score: number = 0;

  grid: Grid = [];

  gridBg: Grid = [];

  flatGrid: Tile[] = [];

  /** component constructor */
  constructor(
    private gridService: GridService,
    @Inject(PLATFORM_ID) platformId: string,
  ) {
    if (isPlatformBrowser(platformId)) {
      this.gridBg = this.gridService.newGrid(DEFAULT_GRID_SIZE);
      this.setGrid(this.gridService.addNewTile(this.gridService.addNewTile(UtilService.deepClone(this.gridBg))));
      console.log(this.grid);
    }
  }

  move(direction: MoveDirection): void {
    this.setGrid(this.gridService.moveTile(this.grid, direction));
  }

  setGrid(grid: Grid): void {
    this.grid = grid;
    this.flatGrid = this.gridService.flatGrid(this.grid);
  }
}
