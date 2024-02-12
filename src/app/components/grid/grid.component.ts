import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DEFAULT_GRID_SIZE } from '../../constants';
import { GridService } from '../../services/grid/grid.service';
import { Grid } from '../../types';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [],
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
  ) {
    this.grid = this.gridService.newGrid(DEFAULT_GRID_SIZE);
    this.grid = this.gridService.addNewTile(this.grid);
    this.grid = this.gridService.addNewTile(this.grid);

    console.log(this.grid);
  }
}
