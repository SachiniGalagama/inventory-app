import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  currentPage = '';

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const routePath = event.urlAfterRedirects.split('/')[1];
        this.currentPage = this.formatPageName(routePath);
      }
    });
  }

  formatPageName(path: string): string {
    if (!path) return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  }
}
