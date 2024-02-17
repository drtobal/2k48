import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, PLATFORM_ID } from '@angular/core';
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
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: string,
  ) {
    if (isPlatformBrowser(platformId)) {
      this.gridBg = this.gridService.newGrid(DEFAULT_GRID_SIZE);
      this.grid = this.gridService.addNewTile(this.gridService.addNewTile(UtilService.deepClone(this.gridBg)));
      this.flatGrid = this.gridService.flatGrid(this.grid);
    }
  }

  move(direction: MoveDirection): void {
    const result = this.gridService.moveTile(this.grid, direction);
    if (result.changed) {
      this.grid = result.grid;
      this.flatGrid = this.gridService.overrideFlatGrid(this.flatGrid, result.movements);
      this.changeDetectorRef.detectChanges();
      setTimeout(() => {
        this.flatGrid = this.gridService.flatGrid(this.grid);
        this.changeDetectorRef.detectChanges();
      }, 250);
    }
  }

  setFlatGridWithDelay(flatGrid: Tile[], time: number): void {
    setTimeout(() => {
      this.flatGrid = flatGrid;
      this.changeDetectorRef.detectChanges();
    }, time);
  }
}
