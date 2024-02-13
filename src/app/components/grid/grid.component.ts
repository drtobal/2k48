import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, PLATFORM_ID } from '@angular/core';
import { DEFAULT_GRID_SIZE } from '../../constants';
import { GridService } from '../../services/grid/grid.service';
import { Grid, MoveDirection } from '../../types';

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

  /** component constructor */
  constructor(
    private gridService: GridService,
    @Inject(PLATFORM_ID) platformId: string,
  ) {
    if (isPlatformBrowser(platformId)) {
      this.grid = this.gridService.addNewTile(this.gridService.addNewTile(this.gridService.newGrid(DEFAULT_GRID_SIZE)));

      console.log(this.grid);
    }
  }

  move(direction: MoveDirection): void {
    this.grid = this.gridService.moveTile(this.grid, direction);
  }
}
