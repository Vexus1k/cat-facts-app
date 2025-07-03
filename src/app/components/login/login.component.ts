import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  public username = signal<string>('');
  public password = signal<string>('');
  public errorMessage = signal<string>('');

  constructor(
    private readonly _authService: AuthService,
    private readonly _router: Router
  ) {}

  public login(): void {
    if (!this.username() || !this.password()) {
      this.errorMessage.set('Please enter both username and password');
      return;
    }

    const success = this._authService.login(this.username(), this.password());

    if (success) {
      this._router.navigate(['/cat-facts']);
    } else {
      this.errorMessage.set('Invalid username or password');
    }
  }

  public updateUsername(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.username.set(value);
    if (this.errorMessage()) {
      this.errorMessage.set('');
    }
  }

  public updatePassword(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.password.set(value);
    if (this.errorMessage()) {
      this.errorMessage.set('');
    }
  }
}
