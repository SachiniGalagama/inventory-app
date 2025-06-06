import { Component } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  standalone: false,
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent {
  showInsights: boolean = false;

  toggleInsights() {
    this.showInsights = !this.showInsights;
  }
}
