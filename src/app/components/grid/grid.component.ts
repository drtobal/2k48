import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { DEFAULT_GRID_SIZE } from '../../constants';
import { GridService } from '../../services/grid/grid.service';
import { ScoreService } from '../../services/score/score.service';
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
export class GridComponent implements OnInit, OnDestroy {
  score: number = 0;

  best: number = 0;

  grid: Grid = [];

  gridBg: Grid = [];

  flatGrid: Tile[] = [];

  gameOver: boolean = true;

  detachEvents: (() => void) | null = null;

  /** component constructor */
  constructor(
    private gridService: GridService,
    private changeDetectorRef: ChangeDetectorRef,
    private scoreService: ScoreService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) platformId: string,
  ) {
    if (isPlatformBrowser(platformId)) {
      this.newGame();
    }
  }

  ngOnInit(): void {
    const action = (event: KeyboardEvent) => this.action(event);
    this.document.addEventListener('keydown', action);

    this.detachEvents = () => {
      this.document.removeEventListener('keydown', action);
    };
  }

  ngOnDestroy(): void {
    this.detachEvents && this.detachEvents();
  }

  newGame(): void {
    this.gridBg = this.gridService.newGrid(DEFAULT_GRID_SIZE);
    this.grid = this.gridService.addNewTile(this.gridService.addNewTile(UtilService.deepClone(this.gridBg)));
    this.flatGrid = this.gridService.flatGrid(this.grid);
    this.best = this.scoreService.getBestScore();
    this.gameOver = false;
  }

  move(direction: MoveDirection): void {
    const result = this.gridService.moveTile(this.grid, direction);
    if (result.changed) {
      this.grid = result.grid;
      this.flatGrid = this.gridService.overrideFlatGrid(this.flatGrid, result.movements);
      this.scoreService.saveBestScore(result.score + this.score);
      this.checkGameOver();
      this.changeDetectorRef.detectChanges();
      setTimeout(() => {
        this.flatGrid = this.gridService.flatGrid(this.grid);
        this.score += result.score;
        this.changeDetectorRef.detectChanges();
      }, 250);
    }
  }

  action(event: KeyboardEvent): void {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        this.move('up');
        break;
      case 'ArrowDown':
      case 'KeyS':
        this.move('down');
        break;
      case 'ArrowLeft':
      case 'KeyA':
        this.move('left');
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.move('right');
        break;
    }
  }

  setFlatGridWithDelay(flatGrid: Tile[], time: number): void {
    setTimeout(() => {
      this.flatGrid = flatGrid;
      this.changeDetectorRef.detectChanges();
    }, time);
  }

  checkGameOver(): void {
    this.gameOver = this.gridService.freeTiles(this.grid).length === 0 && !this.gridService.hasMergesAvailable(this.grid);
  }
}
