import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from '../grid/grid.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, GridComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = '2k48';
}
