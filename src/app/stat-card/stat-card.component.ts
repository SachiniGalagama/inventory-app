// src/app/stat-cards/stat-card.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: false,
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss'],
})
export class StatCardComponent {
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() value: number | string = '';
}
