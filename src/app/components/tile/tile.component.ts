import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DEFAULT_TILE_VALUE } from '../../constants';
import { Tile } from '../../types';

@Component({
  selector: 'app-tile',
  standalone: true,
  imports: [],
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileComponent {
  @Input() tile?: Tile;

  @Input() value: number = DEFAULT_TILE_VALUE;
}
