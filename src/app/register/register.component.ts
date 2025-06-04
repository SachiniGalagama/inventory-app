import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  

  onRegister() {
    this.authService
      .register(this.email, this.password)
      .then(() => {
        alert('Registration successful!');
        this.router.navigate(['/dashboard']);
      })
      .catch((err) => alert('Registration error: ' + err.message));
  }
}
